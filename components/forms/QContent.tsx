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
            {/* <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link> */}

            <p className={` ${isComment? "text-md font-semibold" : "text-md md:text-lg font-bold"} text-white`}>{content}</p>
            {photos?.length > 0 ?
            <div className=" w-full">
              <ImageCard photos={photos} isComment={isComment} />
            </div> : null
            }
            <div className={`${isComment && "mb-10"} mt-5 flex flex-col items-start gap-3`}>
              <Action contentType={contentType} repost={repost} isComment={isComment} likes={likes} currentUser_Id={currentUser_Id} id={id}/>
              {isComment && comments.length > 0 && (
                <Link href={`/${contentType}/${id}`}>
                  <p className='mt-1 text-subtle-medium text-gray-1'>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
        </div>
    </div>
  )
}
