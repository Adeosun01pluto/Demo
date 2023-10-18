import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts, fetchUserQuestions } from "@/lib/actions/user.actions";

import ThreadCard from "../cards/ThreadCard";
import QuestionCard from "../cards/QuestionCard";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
  type: string;
}

async function ThreadsTab({ currentUserId, accountId, accountType, type }: Props) {
  let result: Result;
  let questions: Result;
  if (type === "Questions") {
    questions = await fetchUserQuestions(accountId);
  } else if (type= "Threads") {
    result = await fetchUserPosts(currentUserId);
  }
  return (
    <section className='mt-9 flex flex-col gap-10'>
      {
        type === "Threads" ?
      (result.threads.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))) : type === "Questions" ? 
      (questions?.map((question)=>(
        <QuestionCard 
          key={question._id}
          id={question._id}
          likes={question.likes}
          currentUserId={currentUserId}
          parentId={question.parentId}
          content={question.text}
          author={question.author}
          community={question.community}
          createdAt={question.createdAt}
          comments={question.children}
          photos={question.photos}    
        />
      ))) : null

    }
    </section>
  );
}

export default ThreadsTab;