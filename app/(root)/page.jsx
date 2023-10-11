import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
// import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser()
  if (!user) redirect("/sign-in")
  return (
     <>
      <h1 className="head-text">Home</h1>
      <section className="mt-9 flex flex-col gap-4 md:gap-10">
        {result.posts.length === 0 ? (
          <p>No threads found</p>
        ) : (
          <>
            {result.posts.map((post)=>(
              <ThreadCard 
                key={post._id}
                id={post._id}
                currentuserId={user.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
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