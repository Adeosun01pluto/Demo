"use client";
import "@uploadthing/react/styles.css";
 
import { UploadButton } from "@uploadthing/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { ChangeEvent, useState } from "react";
import { stringify } from "querystring";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";

interface Props {
  userId: string;
}

function PostThread({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing("photos");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  // const { organization } = useOrganization();

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
      picture: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    setIsLoading(true)
    const blob = values.picture;
    let fileUrls: string[] | null = null; // Initialize as null
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].fileUrl) {
        fileUrls = imgRes.map((item) => item.fileUrl);
      }
    }
    await createThread({
      text: values.thread,
      author: userId,
    //   communityId: organization ? organization.id : null,
      communityId: null,
      photos: fileUrls,
      path: pathname,
    });
    setIsLoading(false)
    router.push("/");
  };
  const handleImage = (e:ChangeEvent<HTMLInputElement>, fieldChange:(value:string)=>void) => {
    e.preventDefault();
    const fileReader = new FileReader
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }

  };


  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
        {/* <UploadButton<OurFileRouter>
          endpoint="media"
          onClientUploadComplete={handleClientUploadComplete}
          onUploadError={handleUploadError}
        /> */}
        <FormField
          control={form.control}
          name='picture'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className=''>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={20}
                    height={20}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  accept='image/*'
                  multiple
                  placeholder='Add profile photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {isLoading? <Button type='submit' className={`${isLoading? "" : "bg-primary-500"} `}>
          Loading
        </Button> :
        <Button type='submit' className={`${isLoading? "" : "bg-primary-500"} `}>
          Post Thread
        </Button>
        }
      </form>
    </Form>
  );
}

export default PostThread;