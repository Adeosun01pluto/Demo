import ThreadCard from "@/components/cards/ThreadCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchPosts } from "@/lib/actions/thread.actions";
// import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions"


async function Page({searchParams }) {
  
  const search = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const user = await currentUser()
  const userInfo  = await fetchUser(user?.id)
  if(!userInfo?._id) redirect("/onboarding")
  const result = await fetchPosts({
    userId: userInfo?._id,
    searchString: search,
    pageNumber: 1,
    pageSize: 25
  });
  if (!user) redirect("/sign-in")
  return (
     <>
      <h1 className="head-text">Home</h1>
      <Searchbar routeType="/" />
      <section className="mt-3 md:mt-9 flex flex-col w-full gap-2 md:gap-10">
        {result.posts.length === 0 ? (
          <p>No threads found</p>
        ) : (
          <>
            {result.posts.map((post)=>(
              <ThreadCard 
                key={post._id}
                id={post._id}
                likes={post.likes}
                repost={post.repost}
                currentUserId={user.id}
                currentUser_Id={userInfo._id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                photos={post.photos}
              />
            ))}
          </>
        )
        }
      </section>
    </>
  )
}

export default Page