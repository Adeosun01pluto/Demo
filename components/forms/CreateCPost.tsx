"use client"
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    // TERipple,
    TEModal,
    TEModalDialog,
    TEModalContent,
    TEModalHeader,
    TEModalBody,
} from "tw-elements-react";
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
            {/* <!--Modal body--> */}
            <TEModalBody className="bg-black">
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
                    stroke="white"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <Tabs defaultValue="create thread" className="text-white w-[100%]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger onClick={()=>setActiveTab("create thread")}
                            className={`mx-2 ${
                            activeTab === 'create thread' ? 'bg-blue-400' : 'bg-gray-900'
                            }`}
                            value="create thread"
                        >
                            Create Thread
                        </TabsTrigger>
                        <TabsTrigger onClick={()=>setActiveTab("create question")}
                            className={`mx-2 ${
                            activeTab === 'create question' ? 'bg-blue-400' : 'bg-gray-900'
                            }`}
                            value="create question"
                        >
                            Create Question
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="create thread">
                        {/* <h2 className="">Create Thread</h2> */}
                        <PostThread communityId={communityId} userId={currentUserId} />
                    </TabsContent>
                    <TabsContent value="create question">
                        {/* <h2 className="">Create Question</h2> */}
                        <PostQuestion communityId={communityId} userId={currentUserId} />
                    </TabsContent>
                </Tabs>
            </TEModalBody>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
    </div>
  )
}

export default CreateCPost