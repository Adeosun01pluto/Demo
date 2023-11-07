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

export default function Content({author,photos, isComment, content, id, comments, contentType, currentUser_Id, likes, repost }:Props) {
  return (
    <div>
        <div className={`flex flex-col`}>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold dark:text-dark-1 text-light-1'>
                {author.name}
              </h4>
            </Link>

            <p className='mt-2 text-small-regular dark:text-dark-2 text-light-2'>{content}</p>
            <div className=" w-full">
              <ImageCard photos={photos} isComment={isComment} />
            </div>
            <div className={`${isComment && ""} flex flex-col items-start gap-1`}>
              <Action contentType={contentType} repost={repost} isComment={isComment} likes={likes} currentUser_Id={currentUser_Id} id={id}/>
              {isComment && comments.length > 0 && (
                <Link href={`/${contentType}/${id}`}>
                  <p className='text-subtle-medium dark:text-dark-1 '>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
        </div>
    </div>
  )
}
