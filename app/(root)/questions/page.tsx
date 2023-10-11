import QuestionCard from "@/components/cards/QuestionCard";
import { fetchQuestions } from "@/lib/actions/question.action";
// import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const result = await fetchQuestions(1, 30);
  const user = await currentUser()
  if (!user) redirect("/sign-in")
  return (
     <>
      <h1 className="head-text">Questions</h1>
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