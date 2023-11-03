import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button'
import { fetchCommunityDetails } from '@/lib/actions/community.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { Plus, Share } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { communityTabs } from "@/constants";
import CommunityTabs from "@/components/shared/CommunityTabs";
import CreateCPost from "@/components/forms/CreateCPost";
import C_Action from "@/components/forms/C_Action";

async function page({ params }: { params: { id: string } }) {
  const result = await fetchCommunityDetails(params.id)
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  return (
    <main className="relative">
      {/* Create Float */}
      <div className="fixed z-40 right-2 sm:right-4 xl:right-[290px] bottom-[70px] sm:bottom-[100px] md:bottom-4 ">
        <CreateCPost communityId={params.id} currentUserId={userInfo._id} />
      </div>

      {/* Header */}
      <div className='flex w-full flex-col justify-start'>
        <div className='relative h-[250px] w-full mb-4'>
          {result.profile?
            <Image
            src={result.profile}
            alt='community_logo'
            fill
            className='object-cover'
            /> : 
            <Image
            src="/assets/community.svg"
            alt='community_logo'
            fill
            className='object-cover'
            />
          }
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex-1'>
              <h2 className='text-left text-heading3-bold text-light-1'>
                {result.name}
              </h2>
              <p className='text-base-medium text-gray-1'>@{result.username}</p>
            </div>
          </div>
          {user.id === result.createdBy.id ? (
            <Link href={`/communities/edit/${params.id}`}>
              <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
                <Image
                  src='/assets/edit.svg'
                  alt='logout'
                  width={16}
                  height={16}
                  quality={100}
                />
                <p className='text-light-2 max-sm:hidden'>Edit</p>
              </div>
            </Link>
          ) : null}
        </div>

        <p className='my-2 max-w-lg text-sm text-light-2'>{result.description}</p>
        <div className='w-full justify-between h-12 flex items-center'>
            <div className=' flex gap-3 items-center'>
              {/* <div className='w-24 h-8 bg-white'></div> */}
              <p className='text-sm text-white font-semibold'>{result.members.length} Members</p>
            </div>
            <div className=''>
              {/* <CAction adminId={result.createdBy.id} members={result.members} communityId={params.id} currentUserObjectId={userInfo._id} currentUserId={user.id} /> */}
            <C_Action  adminId={result.createdBy.id} members={result.members} communityId={params.id} currentUserObjectId={userInfo._id} currentUserId={user.id}/>
            {/* <div className="flex gap-2 items-center">
              <Share color='white' />
              {result.createdBy.id === user.id ? null : 
                  (
                  !result.members.includes(userInfo._id) ? 
                  <Button className='rounded-full bg-primary-500'>Join</Button>
                  :
                  <Button className='rounded-full bg-primary-500'>Leave</Button>
                )
              }
            </div> */}
            </div>
        </div>
        <div className='mt-8 h-0.5 w-full bg-dark-3' />
      </div>

      <div className='mt-2'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab : any) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {result.threads.length}
                  </p>
                )}
                {tab.label === "Questions" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {result.questions?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {communityTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              {tab.label}
              <CommunityTabs
                currentUserId={user.id}
                currentUser_Id={userInfo._id}
                communityId={params.id}
                type={tab.label}
                accountType="User"
              />

            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}

export default page