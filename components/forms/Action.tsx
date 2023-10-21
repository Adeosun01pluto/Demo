"use client"
import { likeQuestion, repostQuestion } from "@/lib/actions/question.action";
import { likeThread, repostThread } from "@/lib/actions/thread.actions";
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
    repost?: string[] | []
}

function Action({contentType, id, currentUser_Id, likes, isComment, repost }:Props) {
  const [likesArr, setLikesArr] = useState<string[]>(likes || [])
  const [repostArr, setRepostArr] = useState<string[]>(repost || [])
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
    const repostThreadHandle = async ()=>{
      if(contentType==="questions"){
        const res = await repostQuestion( id,currentUser_Id)
        setRepostArr(res)
      }
      if(contentType==="thread"){
        const res = await repostThread( id,currentUser_Id)
        setRepostArr(res)
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
          {
            isComment? null : repostArr?.includes(currentUser_Id) ? 
            <Image
            onClick={repostThreadHandle}
            src='/assets/retweet-svgrepo-filled.svg'
            alt='heart'
            width={20}
            height={20}
            className='cursor-pointer object-contain'
            /> : 
            <Image
            onClick={repostThreadHandle}
            src='/assets/retweet-svgrepo.svg'
            alt='heart'
            width={20}
            height={20}
            className='cursor-pointer object-contain'
            />
          }
          {isComment? null :
          <span className="text-white">{repostArr?.length}</span>
          }
                {/* <Image
                  src='/assets/repost.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                /> */}
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