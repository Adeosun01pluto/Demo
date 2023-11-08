"use client";

import { fetchPosts } from "@/lib/actions/thread.actions";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
// import { Spinner } from "@/components/ui/spinner";
// import { fetchBeers } from "@/actions/fetch-products";
// import { Beer } from "@/types";
// import { Beers } from "@/components/beers";

export function LoadMore() {
  const [threads, setThread] = useState<[any]>()
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const loadMoreBeers = async () => {
    // Once the page 8 is reached repeat the process all over again.
    await delay(2000);
    const nextPage = (page % 7) + 1;
    const newThread = (await fetchPosts({
        userId: "1245",
        searchString: "",
        pageNumber: 1,
        pageSize: 25
    })) ?? []
    // const newThread = (await fetchPosts({"133", "", nextPage, 20, "desc"})) ?? [];
    // @ts-ignore
    setThread((prevProducts) => [...prevProducts, ...newThread]);
    setPage(nextPage);
  };

  useEffect(() => {
    if (inView) {
      loadMoreBeers();
    }
  }, [inView]);

  return (
    <>
      {/* <Beers beers={beers} /> */}
      <div
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
        ref={ref}
      >
        {/* <Spinner /> */}
      </div>
    </>
  );
}