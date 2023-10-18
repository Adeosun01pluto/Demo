"use client"
import { ChangeEvent, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    TERipple,
    TEModal,
    TEModalDialog,
    TEModalContent,
    TEModalHeader,
    TEModalBody,
} from "tw-elements-react";
// import { Button } from "../ui/button";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PostThread from "./PostThread";
import PostQuestion from "./PostQuestion";
  
interface Props {
    currentUserId : string
    communityId :string
}

function CreateCPost({currentUserId, communityId}: Props) {
  const [activeTab, setActiveTab] = useState("create thread")
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div>
        <div>
      <div className="animation-vibrate flex items-center sm:m-2 justify-center rounded-full absolute bottom-0 right-0 w-10 h-10 z-40 bg-white">
        {/* <!-- Button trigger modal --> */}
        <Button 
            type="button"
            className="rounded-full "
            onClick={() => setShowModal(true)}
        ><Plus color="blue" /></Button>        
      </div>
      {/* <!-- Modal --> */}
      <TEModal show={showModal} setShow={setShowModal}>
        <TEModalDialog>
          <TEModalContent>
            <TEModalHeader>
              {/* <!--Modal title--> */}
              <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                Create Post
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
                <Tabs defaultValue="create thread" className="text-white w-[100%]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger onClick={()=>setActiveTab("create thread")}
                            className={`mx-2 ${
                            activeTab === 'create thread' ? 'bg-gray-600' : 'bg-gray-900'
                            }`}
                            value="create thread"
                        >
                            Create Thread
                        </TabsTrigger>
                        <TabsTrigger onClick={()=>setActiveTab("create question")}
                            className={`mx-2 ${
                            activeTab === 'create question' ? 'bg-gray-600' : 'bg-gray-900'
                            }`}
                            value="create question"
                        >
                            Create Question
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="create thread">
                        <h1 className="head-text">Create Thread</h1>
                        <PostThread communityId={communityId} userId={currentUserId} />
                    </TabsContent>
                    <TabsContent value="create question">
                        <h1 className="head-text">Create Question</h1>
                        <PostQuestion communityId={communityId} userId={currentUserId} />
                    </TabsContent>
                </Tabs>
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

export default CreateCPost