// "use client"
import React from 'react'
import { Button } from '../ui/button'
import { Share } from 'lucide-react'

interface Props {
    adminId:string
    currentUserId : string
    currentUserObjectId: string
    communityId: string
    members:string[] | []
}
export default function C_Action({adminId, currentUserId, communityId, members, currentUserObjectId} : Props) {
  return (
    <div>
        <div className="flex gap-2 items-center">
              <Share color='white' />
              {adminId === currentUserId ? null : 
                  (
                  !members.includes(currentUserObjectId) ? 
                  <Button className='rounded-full bg-primary-500'>Join</Button>
                  :
                  <Button className='rounded-full bg-primary-500'>Leave</Button>
                )
              }
        </div>
    </div>
  )
}
