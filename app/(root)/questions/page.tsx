import QuestionCard from "@/components/cards/QuestionCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchQuestions } from "@/lib/actions/question.action";
// import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page({ searchParams }) {
  const search = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const user = await currentUser()
  const result = await fetchQuestions({
    userId: user.id,
    searchString: search,
    pageNumber: 1,
    pageSize: 25
  });

  if (!user) redirect("/sign-in")
  return (
     <>
      <h1 className="head-text">Questions</h1>
      <Searchbar routeType="questions" />
      <section className="text-white mt-9 flex flex-col gap-10">
      {result.questions.length === 0 ? (
          <p className="">No questions found</p>
        ) : (
          <>
            {result.questions.map((question)=>(
              <QuestionCard 
                key={question._id}
                id={question._id}
                currentuserId={user.id || ""}
                parentId={question.parentId}
                content={question.text}
                author={question.author}
                community={question.community}
                createdAt={question.createdAt}
                comments={question.children}
                image={question.image}
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