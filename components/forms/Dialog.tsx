"use client"
import { ChangeEvent, useState } from "react";
import {
    TERipple,
    TEModal,
    TEModalDialog,
    TEModalContent,
    TEModalHeader,
    TEModalBody,
    TEModalFooter,
} from "tw-elements-react";
// import { Button } from "../ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { usePathname, useRouter } from "next/navigation";
import { CommunityValidation } from "@/lib/validations/thread";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isBase64Image } from "@/lib/utils";
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
import { Input } from "../ui/input";
import Image from "next/image";
import { createCommunity } from "@/lib/actions/community.actions";
  
interface Props {
    currentUserId : string
}

function Dialog({currentUserId}: Props) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing("photos");
  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof CommunityValidation>>({
    resolver: zodResolver(CommunityValidation),
    defaultValues: {
      name: "",
      username: "",
      description: "",
      picture: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommunityValidation>) => {
    setIsLoading(true)
    const blob = values.picture;
    const hasImageChanged = isBase64Image(blob);
    let image : string | ""
    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0] && imgRes[0].fileUrl) {
        image = imgRes[0].url;
      }
    }
    const res = await createCommunity({
      id: "",
      name: values.name,
      username: values.username,
      image,
      description: values.description,
      createdById: currentUserId,
    });
    // setIsLoading(true)
    router.push(`/communities/${res._id}`);
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
    <div>
        <div>
      {/* <!-- Button trigger modal --> */}
      <TERipple rippleColor="white">
        <Button 
          type="button"
          className=" bg-primary-500 leftsidebar_link inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          onClick={() => setShowModal(true)}
        >Create Community</Button>
      </TERipple>

      {/* <!-- Modal --> */}
      <TEModal show={showModal} setShow={setShowModal}>
        <TEModalDialog>
          <TEModalContent>
            <TEModalHeader>
              {/* <!--Modal title--> */}
              <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                Create Community
              </h5>
              {/* <!--Close button--> */}
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </TEModalHeader>
            {/* <!--Modal body--> */}
            <TEModalBody className="bg-black">
            <Form {...form}>
                <form
                    className='flex flex-col justify-start gap-5'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                        <FormLabel className='text-base-semibold text-light-2'>
                            Name of your Community
                        </FormLabel>
                        <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                        <Input
                            type='text'
                            className=''
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
                        <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                        <Input
                            type='text'
                            className=''
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
                        <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                            <Textarea rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
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
                            onChange={(e :any) => handleImage(e, field.onChange)}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                    {/* <TERipple rippleColor="light"> */}
                    <Button
                    type="submit"
                    className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    >
                      Create
                    </Button>
                {/* </TERipple> */}
                </form>
                </Form>
            </TEModalBody>
            {/* <TEModalFooter>
              <TERipple rippleColor="light">
                <button
                  type="button"
                  className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </TERipple>
            </TEModalFooter> */}
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
    </div>
  )
}

export default Dialog