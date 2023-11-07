import Image from "next/image";
import Link from "next/link";
import Action from "./Action";
import ImageCard from "../cards/ImageCard";
import { Author } from "@/lib/types";
import { Suspense } from "react";

interface Props{
    author: Author
    photos?:string[] | [] 
    likes?:string[] | [] 
    repost?:string[] | [] 
    isComment?: boolean;
    content: string;
    id: string;
    comments: {
        author: {
          image: string;
        };
    }[];
    contentType : string;
    currentUser_Id:string
}

export default function QContent({author,photos, isComment, content, id, comments, contentType, currentUser_Id, likes, repost }:Props) {
  return (
    <div>
        <div className='flex flex-col'>
        {isComment? 
            <div className="flex gap-2 items-center mb-2">
              <Link href={`/profile/${author.id}`} className='relative h-8 w-8'>
                <Image
                  src={`${author.image}`}
                  alt='user_community_image'
                  fill
                  className='cursor-pointer object-cover rounded-full'
                />
              </Link>
              <p className=" dark:text-dark-2 text-light-2">{author.name}</p>
            </div>
            :null
          }
            
            <p className={` ${isComment? "text-md" : "text-md md:text-lg font-bold"} dark:text-dark-2 text-light-2`}>{content}</p>
            {photos?.length > 0 ?
            <div className=" w-full">
              <ImageCard photos={photos} isComment={isComment} />
            </div> : null
            }
            <div className={`${isComment && ""} mt-3 flex flex-col items-start gap-3`}>
              <Action contentType={contentType} repost={repost} isComment={isComment} likes={likes} currentUser_Id={currentUser_Id} id={id}/>
              {/* {isComment && comments.length > 0 && (
                <Link href={`/${contentType}/${id}`}>
                  <p className='mt-1 text-subtle-medium dark:text-dark-1'>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )} */}
            </div>
        </div>
    </div>
  )
}
