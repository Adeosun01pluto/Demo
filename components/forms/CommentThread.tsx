"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteThread } from "@/lib/actions/thread.actions";
import { useState } from "react";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function CommentThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;
    const [isCommentOpen, setIsCommentOpen] = useState(false)
  return (
    <>
    <Image
        src='/assets/reply.svg'
        alt='heart'
        width={24}
        height={24}
        className='cursor-pointer object-contain bg-white'
        onClick={()=>setIsCommentOpen(true)}
    //     onClick={async () => {
    //     await deleteThread(JSON.parse(threadId), pathname);
    //     if (!parentId || !isComment) {
    //       router.push("/");
    //     }
    //   }}
    />
    {

    }
    </>
  );
}

export default CommentThread;