"use client"
import { likeThread } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation";
import { useState } from "react";

interface Props{
    id: string;
    contentType : string
    currentUserId:string
    likes?: string[] | []
}

function Action({contentType, id, currentUserId, likes }:Props) {
  const [likesArr, setLikesArr] = useState<string[]>(likes || [])
    const likeThreadHandle = async ()=>{
        const res = await likeThread( id,currentUserId)
        setLikesArr(res)
    }
    return (
    <div>
        <div className='flex gap-3.5'>
          {
            likesArr?.includes(currentUserId) ? 
            <Image
            onClick={likeThreadHandle}
            src='/assets/heart-filledin.svg'
            alt='heart'
            width={24}
            height={24}
            className='cursor-pointer object-contain'
            /> : 
            <Image
            onClick={likeThreadHandle}
            src='/assets/heart-gray.svg'
            alt='heart'
            width={24}
            height={24}
            className='cursor-pointer object-contain'
            />
          }
          <span className="text-white">{likesArr?.length}</span>
                <Link href={`/${contentType}/${id}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>
                <Image
                  src='/assets/repost.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Image
                  src='/assets/share.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
            </div>
    </div>
  )
}

export default Action