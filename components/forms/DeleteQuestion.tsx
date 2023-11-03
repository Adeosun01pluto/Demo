"use client";

import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";


interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteQuestion({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;
  const deleteHandler = () => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this question?");
    if (isConfirmed) {
      // User confirmed, proceed with the deletion
      deleteQuestion(JSON.parse(threadId), pathname)
        .then(() => {
          if (!parentId || !isComment) {
            router.push(`${pathname}`);
          }
        })
        .catch((error) => {
          console.error("Error deleting thread:", error);
        });
    }
  };
  return (
    <Image
      src='/assets/delete.svg'
      alt='delete'
      width={18}
      height={18}
      className='cursor-pointer object-contain'
      onClick={deleteHandler}

    />
  );
}

export default DeleteQuestion;