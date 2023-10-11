import PostThread from "@/components/forms/PostThread"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import {redirect} from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostQuestion from "@/components/forms/PostQuestion";


async function page() {

    const user = await currentUser()
    if(!user){
        return null
    }

    const userInfo  = await fetchUser(user?.id)
    
    if(!userInfo?.onboarded) redirect("/onboarding");

    return (
        <>
        <Tabs defaultValue="create thread" className="text-white w-[100%]">
            <TabsList>
                <TabsTrigger className="bg-gray-600 mx-2 " value="create thread">Create Thread</TabsTrigger>
                <TabsTrigger className="bg-gray-600 mx-2 " value="create question">Create Question</TabsTrigger>
            </TabsList>
            <TabsContent value="create thread">
                <h1 className="head-text">Create Thread</h1>
                <PostThread userId={userInfo?._id} />
            </TabsContent>
            <TabsContent value="create question">
                <h1 className="head-text">Create Question</h1>
                <PostQuestion userId={userInfo?._id} />
            </TabsContent>
        </Tabs>
        </>
    )
}

export default page