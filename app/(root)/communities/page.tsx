import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";
import CommunityCard from "@/components/cards/CommunityCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/forms/Dialog";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const result = await fetchCommunities({ searchString:"", pageNumber:1, pageSize:10, sortBy:"desc" })
  return (
    <>
      <h1 className='head-text'>Communities</h1>
      <div className="mt-2">
        <Dialog currentUserId={userInfo._id}  />
      </div>
      {/* CommunityCard({   */}
      <section className='mt-9 grid grid-cols-2 gap-4'>
        {result.communities.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community._id}
                id={community._id}
                name={community.name}
                username={community.username}
                imgUrl={community.profile}
                description={community.description}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>
      {/* <Pagination
        path='communities'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      /> */}
    </>
  );
}

export default Page;