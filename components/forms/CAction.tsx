"use client"
import { Share } from "lucide-react"
import { Button } from "../ui/button"
import { followCommunity, unfollowCommunity } from "@/lib/actions/community.actions"
import { useState } from "react"

interface Props {
    adminId:string
    currentUserId : string
    currentUserObjectId: string
    communityId: string
    members:string[] | []
}
export default function CAction({adminId, currentUserId, communityId, members, currentUserObjectId} : Props) {
    const [membersArr, setMembersArr] = useState<string[]>(members)
    const join = async () =>{
        await followCommunity(currentUserObjectId, communityId)
        
        // Update the followersArr state after following
        setMembersArr([...membersArr, currentUserObjectId]);
    }
    const leave = async () =>{
        await unfollowCommunity(currentUserObjectId, communityId)
        
        // Update the followersArr state after unfollowing
        setMembersArr(membersArr.filter((follower) => follower !== currentUserObjectId));
    }
  return (
    <div className="flex gap-2 items-center">
        <Share color='white' />
        {adminId === currentUserId ? null : 
        // <Button className='rounded-full bg-primary-500'>Join</Button>
            (
            !membersArr.includes(currentUserObjectId) ? 
            <Button onClick={join} className='rounded-full bg-primary-500'>Join</Button>
            :
            <Button onClick={leave} className='rounded-full bg-primary-500'>Leave</Button>
          )
        }
    </div>
  )
}
