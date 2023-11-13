// "use client"

import ThreadCard from "../cards/ThreadCard"
// import { useState } from "react";

function Thread({posts, user , userInfo, next_cursor} : any) {
    // const [data, setdata] = useState(posts)
  return (
    <section className="mt-3 md:mt-9 flex flex-col w-full gap-2 md:gap-10">
        {posts?.length === 0 ? (
          <p>No threads found</p>
        ) : (
          <>
            {posts?.map((post : any)=>(
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

  )
}

export default Thread