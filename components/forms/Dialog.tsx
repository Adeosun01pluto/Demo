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
import { ThreeDots } from "react-loader-spinner";
  
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
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success'); // You can set the alert type (e.g., success, error)
  const [alertMessage, setAlertMessage] = useState('');
  const form = useForm<z.infer<typeof CommunityValidation>>({
    resolver: zodResolver(CommunityValidation),
    defaultValues: {
      name: "",
      username: "",
      description: "",
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
  const onSubmit = async (values: z.infer<typeof CommunityValidation>) => {
    setIsLoading(true)
    try {
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
      setIsLoading(false)
      showAlert('success', 'Community is created successfully!');
      router.push(`/communities/${res._id}`);
      
    } catch (error) {
      setIsLoading(false)
      showAlert('Error', 'Failed to create Comumunity !');
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
    <div>
        <div>
      {/* <!-- Button trigger modal --> */}
      <button 
        className=" dark:bg-primary-500 bg-primary-500 inline-block rounded px-6 pb-2 pt-2.5 text-md font-medium dark:text-white text-white"
        onClick={() => setShowModal(true)}
      >Create Community</button>

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
            <TEModalBody className="dark:bg-light-2 bg-black">
            <Form {...form}>
                <form
                    className='flex flex-col justify-start gap-5'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-1'>
                        <FormLabel className='text-base-semibold dark:text-dark-2 text-md text-light-2'>
                            Name of your Community
                        </FormLabel>
                        <FormControl className='no-focus border border-dark-4 dark:bg-light-2 dark:text-dark-1 bg-dark-3 text-light-1'>
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
                        <FormItem className='flex w-full flex-col gap-1'>
                        <FormLabel className='text-base-semibold dark:text-dark-2 text-md text-light-2'>
                            Username
                        </FormLabel>
                        <FormControl className='no-focus border border-dark-4 dark:bg-light-2 dark:text-dark-1 bg-dark-3 text-light-1'>
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
                        <FormItem className='flex w-full flex-col gap-1'>
                        <FormLabel className='text-base-semibold dark:text-dark-2 text-md text-light-2'>
                            Description
                        </FormLabel>
                        <FormControl className='no-focus border border-dark-4 dark:bg-light-2 dark:text-dark-1 bg-dark-3 text-light-1'>
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
                        <FormControl className='flex-1 text-base-semibold text-light-2 dark:text-dark-1'>
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
                    {/*  */}
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
                      <Button type='submit' className={`dark:bg-primary-500 dark:text-light-1 text-md text-light-1 bg-primary-500 `}>
                        Create
                      </Button>
                    }
                </form>
                <div className='absolute bottom-[50px] z-[9999] right-0 flex flex-col justify-start gap-5'>
                  {isAlertVisible && (
                    <div
                      className={`alert-${alertType} text-white bg-opacity-50 bg-${
                        alertType === 'success' ? 'green' : 'red'
                      }-700 p-4 rounded-lg`}
                    >
                      {alertMessage}
                    </div>
                  )
                  }
                </div>
                </Form>
            </TEModalBody>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
    </div>
  )
}

export default Dialog