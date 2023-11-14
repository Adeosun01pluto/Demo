"use client"

import { MyContext } from "@/app/(root)/Providers";
import ShowMore from "./LoadMore"
import { useContext } from "react";
import ThreadProvider from "./ThreadProvider";
import ThreadList from "./ThreadList";

function Thread({search, currentUserId, currentUser_Id}:any) {
  const { data, loading, more, load } = useContext(MyContext);
  return (
    <section className="mt-3 md:mt-9 flex flex-col w-full gap-2 md:gap-10">
      <ThreadProvider>
        <ThreadList loading={loading} data={data}  currentUserId={currentUserId} currentUser_Id={currentUser_Id}/>
        <ShowMore load={load} search={search} />
      </ThreadProvider>
    </section>

  )
}

export default Thread