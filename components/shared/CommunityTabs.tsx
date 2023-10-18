import { redirect } from "next/navigation";

import { fetchCommunityMembers, fetchCommunityPosts, fetchCommunityQuestions } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";

import ThreadCard from "../cards/ThreadCard";
import QuestionCard from "../cards/QuestionCard";
import UserCard from "../cards/UserCard";

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
  communityId: string;
  accountType: string;
  type: string;
}

interface Members {
  _id: string;
  id: string;
  image: string;
  name: string;
  username: string;
}

async function CommunityTabs({ currentUserId,type, communityId, accountType }: Props) {
  let result: Result;
  let question: Result;
  let members: Members;
  // console.log(communityId)
  if (type === "Threads") {
    result = await fetchCommunityPosts(communityId);
  } else if (type === "Questions"){
    question = await fetchCommunityQuestions(communityId);
  } else if (type === "Members"){
    members = await fetchCommunityMembers(communityId);
  }

  console.log(members)
  return (
    <section className='mt-9 flex flex-col gap-10'>
      {type === "Threads" ?
        (result.map((thread) => (
          <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          photos={thread.photos}
          />
        )))
        : type === "Questions" ?
        (question.map((question)=>(
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
        ))) : type === "Members" ?
        (members.map((person)=>(
          <UserCard 
            key={person.id}
            id={person.id}
            id={person.id}
            name={person.name}
            username={person.username}
            imgUrl={person.image}
            personType="User"
          />
        ))) : null
    }
    </section>
  );
}

export default CommunityTabs;