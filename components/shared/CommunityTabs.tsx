import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";

import ThreadCard from "../cards/ThreadCard";

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

async function CommunityTabs({ currentUserId,type, communityId, accountType }: Props) {
  let result: Result;
  // console.log(communityId)
  if (type === "Threads") {
    result = await fetchCommunityPosts(communityId);
  } else if (type === "Questions"){
    // result = await fetchUserPosts(communityId);
  }

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
        : null
    }
    </section>
  );
}

export default CommunityTabs;