import Image from "next/image";
import Link from "next/link";
import Action from "./Action";

interface Props{
    author: {
        name: string;
        image: string;
        id: string;
    };
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
    currentUserId:string
}

export default function Content({author,photos, isComment, content, id, comments, contentType, currentUserId, likes }:Props) {
  return (
    <div>
        <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link>

            <p className='mt-2 text-small-regular text-light-2'>{content}</p>
            {
              !isComment && (
                <div>
                  {
                    photos?.map((photo) => (
                      <Image
                        src={photo}
                        alt='photo'
                        width={200}
                        height={12}
                        // quality={100}
                        className='cursor-pointer my-1 rounded-sm'
                      />
                    ))
                  }
                </div>
              )
            }

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <Action contentType={contentType} likes={likes} currentUserId={currentUserId} id={id}/>
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
