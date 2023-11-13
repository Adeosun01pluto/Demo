import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import CommunityProfile from "@/components/forms/CommunityProfile";

// Copy paste most of the code as it is from the /onboarding

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;
  const result = await fetchCommunityDetails(params.id)
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const communityData = {
    id: userInfo._id,
    objectId: result?._id,
    username: result ? result?.username : "",
    name: result ? result?.name : user.firstName ?? "",
    description: result ? result?.description : "",
    profile: result ? result?.profile : "",
  };

  return (
    <>

      <section className='bg-dark-2 dark:bg-light-2 mt-12'>
        <div className="px-8 py-2">
          <h1 className='head-text'>Edit Community</h1>
          <p className='mt-3 text-base-regular dark:text-dark-1 text-light-2'>Make any changes</p>
        </div>
        <CommunityProfile community={communityData} paramsId={params.id} btnTitle='Save' />
      </section>
    </>
  );
}

export default Page;