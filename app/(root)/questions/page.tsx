import QuestionCard from "@/components/cards/QuestionCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchQuestions } from "@/lib/actions/question.action";
import { fetchUser } from "@/lib/actions/user.actions";
// import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface SearchParams {
  q: string;
}


async function Page({ searchParams } :{ searchParams: SearchParams }) {
  const search = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const user = await currentUser()
  if(!user){
    return null
  }
  const userInfo  = await fetchUser(user.id)
  const result = await fetchQuestions({
    userId: userInfo._id,
    searchString: search,
    pageNumber: 1,
    pageSize: 25
  });
  if (!user) redirect("/sign-in")
  return (
     <>
      <h1 className="head-text">Questions</h1>
      <Searchbar routeType="questions" />
      <section className="text-white mt-3 md:mt-9 flex flex-col gap-2 md:gap-10">
      {result.questions.length === 0 ? (
          <p className="">No questions found</p>
        ) : (
          <>
            {result.questions.map((question)=>(
              <QuestionCard 
                key={question._id}
                id={question._id}
                likes={question.likes}
                repost={question.repost}
                currentUserId={user.id}
                currentUser_Id={userInfo._id}
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
    </>
  )
}

export default Page