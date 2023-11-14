import React from 'react'
import QuestionCard from '../cards/QuestionCard'

export default function QuestionList({questions, currentUser_Id, loading, currentUserId}:any) {
  // if (loading) {
  //   return <p className='text-center'>Please be patient...</p>;
  // }
  return (
    <div>
    <section className="mt-3 md:mt-9 flex flex-col w-full gap-2 md:gap-10">
    {questions?.length === 0 ? (
          <p className="text-center">No questions found Yet</p>
        ) : (
          <>
            {questions?.map((question : any)=>(
              <QuestionCard 
                key={question._id}
                id={question._id}
                likes={question.likes}
                repost={question.repost}
                currentUserId={currentUserId}
                currentUser_Id={currentUser_Id}
                parentId={question.parentId}
                content={question.text}
                author={question.author}
                community={question.community}
                createdAt={question.createdAt}
                comments={question.children}
                photos={question.photos}    
              />


            ))}
          </>
        )
        }
    </section>
    </div>
  )
}
