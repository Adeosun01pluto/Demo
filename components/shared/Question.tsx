"use client"

import { MyContext } from "@/app/(root)/Providers";
import ShowMore from "./LoadMore"
import { useContext } from "react";
import QuestionProvider from "./QuestionProvider";
import QuestionList from "./QuestionList";

function Question({search, currentUserId, currentUser_Id}:any) {
  const { questions, loadQuestions, loading } = useContext(MyContext);
  return (
    <section className="mt-3 md:mt-9 flex flex-col w-full gap-2 md:gap-10">
      <QuestionProvider>
        <QuestionList loading={loading} questions={questions}  currentUserId={currentUserId} currentUser_Id={currentUser_Id}/>
        <ShowMore load={loadQuestions} search={search}/>
      </QuestionProvider>
    </section>

  )
}

export default Question