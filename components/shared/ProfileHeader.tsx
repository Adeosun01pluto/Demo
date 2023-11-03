"use client"
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Share } from "lucide-react";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
 

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: string;
  userIdToFollow:string
  createdAt:string
  currentUserId:string
  followings:string[] | []
  followers:string[] | []
}

function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
  currentUserId,
  userIdToFollow,
  followers,
  followings,createdAt
}: Props) {
  const [followersArr, setFollowersArr] = useState<string[]>(followers)
  const follow = async () => {
    if (!followersArr.includes(currentUserId)) {
      await followUser(currentUserId, userIdToFollow);
      // Update the followersArr state after following
      setFollowersArr([...followersArr, currentUserId]);
    }
  };
  
  const unfollow = async () => {
    if (followersArr.includes(currentUserId)) {
      await unfollowUser(currentUserId, userIdToFollow);
      // Update the followersArr state after unfollowing
      setFollowersArr(followersArr.filter((follower) => follower !== currentUserId));
    }
  };

  const handleShareClick = () => {
    // Get the current URL
    const currentURL = window.location.href;
    // Copy the URL to the clipboard
    navigator.clipboard.writeText(currentURL);
  };
  return (
    <div className='flex w-full flex-col justify-start'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative h-20 w-20 object-cover'>
            <Image
              src={imgUrl}
              alt='logo'
              fill
              className='rounded-full object-cover shadow-2xl'
            />
          </div>

          <div className='flex-1'>
            <h2 className='text-left text-heading3-bold text-light-1'>
              {name}
            </h2>
            <p className='text-base-medium text-gray-1'>@{username}</p>
          </div>
        </div>
        {accountId === authUserId && type !== "Community" && (
          <Link href='/profile/edit'>
            <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
              <Image
                src='/assets/edit.svg'
                alt='logout'
                width={16}
                height={16}
              />
              <p className='text-light-2 max-sm:hidden'>Edit</p>
            </div>
          </Link>
        )}
      </div>

      <p className='my-2 max-w-lg text-base-regular text-light-2'>{bio}</p>
      {/* <p className=' max-w-lg text-base-regular text-light-2'>Joined {createdAt}</p> */}
      <div className='w-full justify-between flex items-center'>
            <div className=' flex gap-2 items-center'>
              <p className='text-xs text-white'>{followersArr.length} Followers</p>
              <p className='text-xs text-white'>{followings.length} Followings</p>
            </div>
            <div className='flex gap-2 items-center'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* <Button variant="outline"> */}
                    <Share color='white' onClick={handleShareClick} className="cursor-pointer" />
                    {/* </Button> */}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Copy URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {
                currentUserId === userIdToFollow ? 
                null : 
                (
                  !followersArr.includes(currentUserId) ? 
                  <Button onClick={follow} className='rounded-full bg-primary-500'>Follow</Button>
                  :
                  <Button onClick={unfollow} className='rounded-full border-[1px] border-primary-500'>Unfollow</Button>
                )
              }
            </div>
      </div>
      <div className='mt-12 h-0.5 w-full bg-dark-3' />
    </div>
  );
}

export default ProfileHeader;   