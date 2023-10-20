import Image from "next/image";
import Link from "next/link";
import Action from "./Action";
import ImageCard from "../cards/ImageCard";
import { Author } from "@/lib/types";

interface Props{
    author: Author
    photos?:string[] | [] 
    likes?:string[] | [] 
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

export default function Content({author,photos, isComment, content, id, comments, contentType, currentUser_Id, likes }:Props) {
  return (
    <div>
        <div className='flex 500 flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link>

            <p className='mt-2 text-small-regular text-light-2'>{content}</p>
            <div className=" w-full">
              <ImageCard photos={photos} isComment={isComment} />
            </div>
            {/* {
              !isComment && (
                <div className="w-full ">
                  {
                    photos?.map((photo) => (
                      <div>
                        <Image
                          src={photo}
                          alt='photo'
                          width={100}
                          height={1}
                          // fill
                          layout="fixed" // Use a responsive layout
                          quality={100}
                          className='cursor-pointer w-[700px]  object-cover my-1 rounded-xl'
                        />
                      </div>
                    ))
                  }
                </div>
              )
            } */}

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col items-start gap-3`}>
              <Action contentType={contentType} isComment={isComment} likes={likes} currentUser_Id={currentUser_Id} id={id}/>
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
