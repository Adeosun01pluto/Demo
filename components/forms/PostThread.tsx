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
import { createCommunityThread } from "@/lib/actions/community.actions";
import { ThreeDots } from "react-loader-spinner";

interface Props {
  userId: string;
  communityId:string | null
}

function PostThread({ userId, communityId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing("photos");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success'); // You can set the alert type (e.g., success, error)
  const [alertMessage, setAlertMessage] = useState('');


  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
      picture: "",
    },
  });
  const showAlert = (type: string, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);

    // Hide the alert after 5 seconds (you can adjust the duration)
    setTimeout(() => {
      setAlertVisible(false);
    }, 2000);
  };

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    // if (values.files.length > 4) {
    //     alert("Only 5 files accepted.");
    //     values.preventDefault();
    // }
    setIsLoading(true)
    try {
      const blob = values.picture;
      let fileUrls: string[] | null = null; // Initialize as null
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);
        if (imgRes && imgRes[0].fileUrl) {
          fileUrls = imgRes.map((item) => item.fileUrl);
        }
      }
      const res = await createThread({
          text: values.thread,
          author: userId,
          communityId: communityId,
          photos: fileUrls,
          path: pathname,
      });
      console.log(res)
      // Reset the form fields to empty values
      form.reset({});
      setIsLoading(false)
      showAlert('success', 'Thread posted successfully!');
      if(communityId){
        router.push(`/communities/${communityId}`);
      }else{
        router.push(`/`);
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      showAlert('Error', 'Failed to Post Question !');
    }
  };
  
  const handleImage = (e:ChangeEvent<HTMLInputElement>, fieldChange:(value:string)=>void) => {
    e.preventDefault();
    const fileReader = new FileReader;
  
    if (e.target.files && e.target.files.length > 4) {
      // Show an alert or provide feedback that only 4 files are accepted
      showAlert('error', 'Only 4 files are accepted.');
      // Clear the file input
      e.target.value = '';
      return;
    }
  
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
    <div className="relative">
      <Form {...form}>
        <form
          className='mt-5 flex flex-col justify-start gap-5'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='thread'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold dark:text-dark-2 text-lg text-light-2'>
                  Content
                </FormLabel>
                <FormControl className='no-focus border border-dark-4 dark:border-none dark:text-dark-1 dark:bg-light-2  bg-dark-3 text-light-1'>
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
                <FormControl className='flex-1 text-base-semibold dark:text-dark-2 text-light-2'>
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
          {isLoading? 
          <Button type='submit' className={`w-full flex justify-center dark:bg-primary-500 dark:text-light-1 text-light-1 bg-primary-500`}>
            <ThreeDots 
              height="50" 
              width="50" 
              radius="9"
              color="#fff" 
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              // wrapperClassName=""
              visible={true}
            />
          </Button> :
          <Button type='submit' className={`dark:bg-primary-500 dark:text-light-1 text-light-1 bg-primary-500 `}>
            Post Thread
          </Button>
        }
        </form>
      </Form>
      <div className='absolute bottom-[50px] z-[9999] right-0 flex flex-col justify-start gap-5'>
        {isAlertVisible && (
          <div
            className={`alert-${alertType} bg-opacity-50 bg-${
              alertType === 'success' ? 'green' : 'red'
            }-700 p-4 rounded-lg`}
          >
            {alertMessage}
          </div>
        )
        }
      </div>
    </div>
  );
}

export default PostThread;