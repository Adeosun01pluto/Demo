"use client"
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { z } from "zod";
import { CommunityValidation } from "@/lib/validations/thread";
import { updateCommunityInfo } from "@/lib/actions/community.actions";

interface Props {
    community: {
      id: string;
      objectId: string;
      username: string | "";
      name: string | "";
      description: string;
      profile: string | "";
    };
    btnTitle: string;
    paramsId: string;
}

function CommunityProfile({community, btnTitle, paramsId} : Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { startUpload } = useUploadThing("media");
    const [files, setFiles] = useState<File[]>([]);
    const form = useForm({
        resolver: zodResolver(CommunityValidation),
        defaultValues: {
            picture: community?.profile || "",
            name: community?.name || "",
            username: community?.username || "",
            description: community?.description || "",
        } 
    })
    
    const onSubmit = async (values: z.infer<typeof CommunityValidation>) => {
      const blob = values.picture;
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].fileUrl) {
          values.picture = imgRes[0].fileUrl;
        }
      }
    //   // TODO : update community profile
      const res = await updateCommunityInfo({
        communityId: community.objectId,
        name: values.name,
        username: values.username,
        description: values.description,
        profile: values.picture,
    });
    console.log(res)
    router.push(`/communities/${paramsId}`);
    //   if (pathname === "/profile/edit") {
    //     router.back();
    //   } else {
    //   }
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
        className='flex flex-col p-4 sm:p-10 md:w-[65%] mx-auto justify-start gap-4 md:gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='picture'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label w-full h-full'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='picture'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full w-full h-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='picture'
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
                  placeholder='Add community photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          {btnTitle}
        </Button>
      </form>
    </Form>

    )
}

export default CommunityProfile