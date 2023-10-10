import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  const userInfo ={};
  if (userInfo?.onboarded) redirect("/");

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };
  return (
    <main className='mx-auto flex max-w-3xl  flex-col justify-start px-10 py-20'>
      <h1 className='text-heading2-bold text-light-1'>Onboarding</h1>
      <p className='text-center mt-3 text-base-regular text-light-2'>
        Complete your profile now, to use Threds.
      </p>

      <section className='mt-9 bg-dark-2'>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </main>
  );
}

export default Page;