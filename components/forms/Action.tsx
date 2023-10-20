"use client"
import { likeQuestion } from "@/lib/actions/question.action";
import { likeThread } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation";
import { useState } from "react";

interface Props{
    id: string;
    contentType : string
    currentUser_Id:string
    isComment?: boolean | undefined
    likes?: string[] | []
}

function Action({contentType, id, currentUser_Id, likes, isComment }:Props) {
  const [likesArr, setLikesArr] = useState<string[]>(likes || [])
    const likeThreadHandle = async ()=>{
      if(contentType==="questions"){
        const res = await likeQuestion( id,currentUser_Id)
        setLikesArr(res)
      }
      if(contentType==="thread"){
        const res = await likeThread( id,currentUser_Id)
        setLikesArr(res)
      }
    }
    return (
    <div>
        <div className='flex gap-3.5'>
          {
            isComment? null : likesArr?.includes(currentUser_Id) ? 
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
          {isComment? null :
          <span className="text-white">{likesArr?.length}</span>
          }
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