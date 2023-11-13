// "use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Share } from 'lucide-react'
import { followCommunity, unfollowCommunity } from '@/lib/actions/community.actions'

interface Props {
    adminId:string
    currentUserId : string
    currentUserObjectId: string
    communityId: string
    members:string[] | []
}
export default function C_Action({adminId, currentUserId, communityId, members, currentUserObjectId} : Props) {
  // const [membersArr, setMembersArr] = useState<string[]>(members)
  // const join = async () =>{
  //     await followCommunity(currentUserObjectId, communityId)
      
  //     // Update the followersArr state after following
  //     setMembersArr([...membersArr, currentUserObjectId]);
  // }
  // const leave = async () =>{
  //     await unfollowCommunity(currentUserObjectId, communityId)
      
  //     // Update the followersArr state after unfollowing
  //     setMembersArr(membersArr.filter((follower) => follower !== currentUserObjectId));
  // }

  // const handleShareClick = () => {
  //   // Get the current URL
  //   const currentURL = window.location.href;
  //   // Copy the URL to the clipboard
  //   navigator.clipboard.writeText(currentURL);
  // };

  return (
    <div>
        <div className="flex gap-2 items-center">
              <Share color='white' />
              {/* <Share onClick={handleShareClick} color='white' /> */}
              {/* {adminId === currentUserId ? null : 
                  (
                  !members.includes(currentUserObjectId) ? 
                  // <Button onClick={join} className='rounded-full bg-primary-500'>Join</Button>
                  <Button className='rounded-full bg-primary-500'>Join</Button>
                  :
                  // <Button onClick={leave} className='rounded-full border-[1px] border-primary-500'>Leave</Button>
                  <Button className='rounded-full border-[1px] border-primary-500'>Leave</Button>
                )
              } */}
        </div>
    </div>
  )
}
