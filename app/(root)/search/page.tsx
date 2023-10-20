import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import UserCard from '../../../components/cards/UserCard'
import Searchbar from '@/components/shared/Searchbar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
interface SearchParams {
  q: string;
}



async function Page({searchParams} : { searchParams: SearchParams }) {
  const user = await currentUser()
  if(!user) return null

  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) redirect("/onboading")
  const search = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const result  = await fetchUsers({
    userId: user.id,
    searchString: search,
    pageNumber: 1,
    pageSize: 25
  })

  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>
      {/* <SearchTabs /> */}
      <Searchbar routeType="search" />
      {/* Search Bar */}
        {result.users.length === 0? (
          <p className='no-result'>No users</p>
        ) : (
          <>
            {result.users.map((person)=>(
              <UserCard 
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )
        }

    </section>
  )
}

export default Page