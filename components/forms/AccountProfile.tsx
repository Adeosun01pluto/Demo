"use client"
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { UserValidation } from "@/lib/validations/user";
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
import { ThreeDots } from "react-loader-spinner";

interface Props {
    user: {
      id: string;
      objectId: string;
      username: string;
      name: string;
      bio: string;
      image: string;
    };
    btnTitle: string;
}

function AccountProfile({user, btnTitle} : Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { startUpload } = useUploadThing("media");
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success'); // You can set the alert type (e.g., success, error)
    const [alertMessage, setAlertMessage] = useState('');
    const showAlert = (type: string, message: string) => {
      setAlertType(type);
      setAlertMessage(message);
      setAlertVisible(true);
  
      // Hide the alert after 5 seconds (you can adjust the duration)
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    };
    
    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
        } 
    })
    
    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
      setIsLoading(true)
      try {
        const blob = values.profile_photo;
        const hasImageChanged = isBase64Image(blob);
        if (hasImageChanged) {
          const imgRes = await startUpload(files);

          if (imgRes && imgRes[0].fileUrl) {
            values.profile_photo = imgRes[0].fileUrl;
          }
        }
        // TODO : update user profile
        await updateUser({
          name: values.name,
          path: pathname,
          username: values.username,
          userId: user.id,
          bio: values.bio,
          image: values.profile_photo,
        });
        setIsLoading(false)
        showAlert('success', 'Profile is Updated Successfully!');  
        if (pathname === "/profile/edit") {
          router.back();
        } else {
          router.push("/");
        }
    } catch (error) {
      setIsLoading(false)
      showAlert('Error', 'Failed to updated Profile !');
      console.log(error)
    }
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
        className='flex flex-col p-4 sm:p-10 md:w-[75%] mx-auto justify-start gap-4 md:gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
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
              <FormControl className='flex-1 text-base-semibold dark:text-dark-1 text-light-2'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
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
              <FormLabel className='text-base-semibold dark:text-dark-1 text-light-2'>
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
              <FormLabel className='text-base-semibold dark:text-dark-1 text-light-2'>
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
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold dark:text-dark-1 text-light-2'>
                Bio
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
            <Button type='submit' className='dark:bg-primary-500 text-light-1 dark:text-light-1 bg-primary-500'>
            {btnTitle}
          </Button>
          }
        
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
      </form>
    </Form>

    )
}

export default AccountProfile