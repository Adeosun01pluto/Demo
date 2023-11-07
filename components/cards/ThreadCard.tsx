import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";
import Content from "../forms/Content";
import { Community } from "@/lib/types";

interface Props {
  id: string;
  currentUserId: string;
  currentUser_Id: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: Community | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  photos?:string[] | [] 
  likes?:string[] | [] 
  repost?:string[] | [] 
}

function ThreadCard({
  id,
  currentUserId,
  currentUser_Id,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  photos,
  likes,
  repost
}: Props) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-3 py-3 my-2 dark:bg-light-2" : "dark:bg-light-2 bg-dark-2 p-3 md:p-7"
      }`}
    >
      <div className='flex items-start w-full justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={`${author.image}`}
                alt='user_community_image'
                fill
                className='cursor-pointer object-cover rounded-full'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>
          <div className="w-full">
            <Content contentType={"thread"} repost={repost} likes={likes} author={author} photos={photos} isComment={isComment} content={content} id={id} comments={comments} currentUser_Id={currentUser_Id}/>
          </div>
        </div>
        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 flex items-center gap-2'>
          <div className="flex gap-4 items-center h-[15px]">
            {comments.slice(0, 3).map((comment, index) => (
              <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={15}
              height={20}
              // objectFit="cover"
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
              />
            ))}
          </div>

          <Link href={`/thread/${id}`}>
            <p className='mt-1 text-subtle-medium text-gray-1'>
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}
      
      {!isComment && community && (
        <Link
          href={`/communities/${community._id}`}
          className='mt-5 flex items-center'
        >
          <p className='text-subtle-medium text-gray-1'>
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>

          <Image
            src={community?.profile}
            alt={community.name}
            width={12}
            height={12}
            objectFit="contain"
            quality={100}
            className='ml-1 rounded-full object-cover'
          />
        </Link>
      )}      
    </article>
  );
}

export default ThreadCard;
