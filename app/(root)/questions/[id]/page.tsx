import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchQuestionById } from "@/lib/actions/question.action";
import QuestionCard from "@/components/cards/QuestionCard";
import CommentQuestion from "@/components/forms/CommentQuestion";


export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const question = await fetchQuestionById(params.id);

  return (
    <section className='relative'>
      <div>
        <QuestionCard
          id={question._id}
          currentUserId={user.id}
          parentId={question.parentId}
          content={question.text}
          author={question.author}
          community={question.community}
          createdAt={question.createdAt}
          comments={question.children}
        />
      </div>

      <div className='mt-7'>
        <CommentQuestion
          questionId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className='mt-10'>
        {question.children.map((childItem: any) => (
          <QuestionCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;