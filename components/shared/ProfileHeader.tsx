"use client"
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Share } from "lucide-react";
import { followUser } from "@/lib/actions/user.actions";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: string;
  userIdToFollow:string
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
  followings
}: Props) {
  const follow = async () =>{
    await followUser(currentUserId, userIdToFollow)
  }
  // const unfollow = async () =>{
  //   await unfollowUser(currentUserId, userIdToFollow)
  // }
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

      <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>
      <div className='w-full justify-between h-12 flex items-center'>
            <div className=' flex gap-3 items-center'>
              <div className='w-24 h-8 bg-white'></div>
              <p className='text-sm text-white font-semibold'>{5.3}K Members</p>
            </div>
            <div className='flex gap-2 items-center'>
              <Share color='white' />
              {
                currentUserId === userIdToFollow ? 
                null : 
                (
                  !followers.includes(currentUserId) ? 
                  <Button onClick={follow} className='rounded-full bg-primary-500'>Follow</Button>
                  :
                  <Button onClick={follow} className='rounded-full bg-primary-500'>Unfollow</Button>
                )
              }
            </div>
      </div>
      <div className='mt-12 h-0.5 w-full bg-dark-3' />
    </div>
  );
}

export default ProfileHeader;   