import PostThread from "@/components/forms/PostThread"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import {redirect} from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostQuestion from "@/components/forms/PostQuestion";
import TabsComponent from "@/components/forms/TabsComponent";


async function page() {

    const user = await currentUser()
    if(!user){
        return null
    }

    const userInfo  = await fetchUser(user?.id)
    
    if(!userInfo?.onboarded) redirect("/onboarding");

    return (
        <>
            <TabsComponent _id={userInfo?._id} />        
        </>
    )
}

export default page