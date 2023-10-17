"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostThread from "./PostThread";
import PostQuestion from "./PostQuestion";
import { useState } from "react";

function TabsComponent({_id}: {_id :string}) {
    const [activeTab, setActiveTab] = useState("create thread")
    return (
    <div>
        <Tabs defaultValue="create thread" className="text-white w-[100%]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger onClick={()=>setActiveTab("create thread")}
                    className={`mx-2 rounded-sm p-2 font-semibold text-md ${
                    activeTab === 'create thread' ? 'bg-blue-400' : ''
                    }`}
                    value="create thread"
                >
                    Create Thread
                </TabsTrigger>
                <TabsTrigger onClick={()=>setActiveTab("create question")}
                    className={`mx-2 rounded-sm p-2 font-semibold text-md ${
                    activeTab === 'create question' ? 'bg-blue-400' : ''
                    }`}
                    value="create question"
                >
                    Create Question
                </TabsTrigger>
            </TabsList>
            <TabsContent value="create thread">
                <h1 className="head-text">Create Thread</h1>
                <PostThread communityId={null} userId={_id} />
            </TabsContent>
            <TabsContent value="create question">
                <h1 className="head-text">Create Question</h1>
                <PostQuestion userId={_id} communityId={null}/>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default TabsComponent