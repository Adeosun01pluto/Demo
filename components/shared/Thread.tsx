// "use client"

// import { fetchPosts } from "@/lib/actions/thread.actions";
// import ThreadCard from "../cards/ThreadCard"
// // import { useInfiniteQuery } from "@tanstack/react-query";
// // import { useEffect, useRef } from "react";

// function Thread({result, user , userInfo} : any) {

//     // const fetchData = async (page :any) => {
//     //     const result = await fetchPosts({
//     //         userId: userInfo?._id,
//     //         searchString: "",
//     //         pageNumber: 1,
//     //         pageSize: 25
//     //     });
//     //     return  result;
//     // }
//     // const myRef = useRef(null)

//     // const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
//     //   ['query'], 
//     //   async ({pageParam = 1}) => await fetchData(pageParam), 
//     //     // @ts-ignore
//     //   {
//     //     // @ts-ignore
//     //     getNextPageParam: (_, pages) => pages.length + 1
//     //   }
//     // )
  
//     // useEffect(()=> {
//     //   const observer = new IntersectionObserver( 
//     //     (entries) => {entries.forEach( e => fetchNextPage())
//     //   })
//     //   if (myRef.current) {
//     //     observer.observe(myRef.current)
//     //   }
//     // }, [myRef])
//     // const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
//     //     ['query'], 
//     //     async ({pageParam = 1}) => await fetchData(pageParam), 
//     //     // @ts-ignore
//     //     {
//     //         // @ts-ignore
//     //       getNextPageParam: (_, pages:any) => pages?.length + 1
//     //     }
//     //   )
//   return (
    
//     <section className="mt-3 md:mt-9 flex flex-col w-full gap-2 md:gap-10">
//         {result.posts.length === 0 ? (
//           <p>No threads found</p>
//         ) : (
//           <>
//             {result.posts.map((post : any)=>(
//               <ThreadCard 
//                 key={post._id}
//                 id={post._id}
//                 likes={post.likes}
//                 repost={post.repost}
//                 currentUserId={user.id}
//                 currentUser_Id={userInfo._id}
//                 parentId={post.parentId}
//                 content={post.text}
//                 author={post.author}
//                 community={post.community}
//                 createdAt={post.createdAt}
//                 comments={post.children}
//                 photos={post.photos}
//               />
//             ))}
//           </>
//         )
//         }
//     </section>

//   )
// }

// export default Thread