import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";

// Copy paste most of the code as it is from the /onboarding

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <div className="">
      
      <section className='mt-12 bg-light-2'>
        <div className="md:w-[75%] mx-auto justify-start py-1">
          <h1 className='head-text'>Edit Profile</h1>
          <p className='mt-3 text-base-regular dark:text-dark-1 text-light-2'>Make any changes</p>
        </div>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </div>
  );
}

export default Page;