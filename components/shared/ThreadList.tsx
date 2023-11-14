import React from 'react';
import ThreadCard from '../cards/ThreadCard';

export default function ThreadList({ data, currentUser_Id, loading, currentUserId }: any) {
  // if (loading) {
  //   return <p className='text-center'>Please be patient...</p>;
  // }

  return (
    <div>
      <section className="mt-3 md:mt-9 flex flex-col w-full gap-2 md:gap-10">
        {data?.length === 0 ? (
          <p>No threads found yet</p>
        ) : (
          <>
            {data?.map((post: any) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                likes={post.likes}
                repost={post.repost}
                currentUserId={currentUserId}
                currentUser_Id={currentUser_Id}
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
        )}
      </section>
    </div>
  );
}
