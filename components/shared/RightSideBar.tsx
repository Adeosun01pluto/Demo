import { fetchCommunities } from "@/lib/actions/community.actions"
import CommunityCard from "../cards/CommunityCard"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import { currentUser } from "@clerk/nextjs"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import UserCard from "../cards/UserCard"

async function RightSideBar() {
  const user = await currentUser()
  if(!user) return null

  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) redirect("/onboarding")
  const result = await fetchCommunities({searchString : "",
  pageNumber : 1,
  pageSize : 20,
  sortBy : "desc",})
  const users  = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25
  })
  
  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Comunities</h3>
        {
          result.communities.map((community)=>(
            <article key={community._id} className='flex mt-3 w-full items-center gap-2'>
                  <div className='flex flex-wrap flex-1 items-center gap-2'>
                    <Link href={`/communities/${community._id}`} className='relative h-8 w-8'>
                      {community.profile?
                        <Image
                        src={community.profile}
                        alt='community_logo'
                        fill
                        className='rounded-full object-cover'
                        /> : 
                        <Image
                        src="/assets/community.svg"
                        alt='community_logo'
                        fill
                        className='rounded-full object-cover'
                        />
                      }
                    </Link>

                    <div>
                      <Link href={`/communities/${community._id}`}>
                        <h4 className='text-sm font-semibold text-light-1'>{community.name}</h4>
                      </Link>
                      <p className='text-xs text-gray-1'>@{community.username}</p>
                    </div>
                  </div>
                  <Link href={`/communities/${community._id}`}>
                    <Button className='user-card_btn'>
                      View
                    </Button>
                  </Link>
                </article>
          ))
        }
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
          <div>
            {users.users.map((person)=>(
                <article key={person._id} className='user-card my-2'>
                  <div className='user-card_avatar'>
                    <div className='relative h-8 w-8'>
                      <Image
                        src={person.image}
                        alt='user_logo'
                        fill
                        className='rounded-full object-cover'
                      />
                    </div>
            
                    <div className='flex-1 text-ellipsis'>
                      <h4 className='text-sm font-semibold text-light-1'>{person.name}</h4>
                      <p className='text-xs text-gray-1'>@{person.username}</p>
                    </div>
                  </div>
                  <Link href={`/profile/${person.id}`}>
                    <Button className='user-card_btn'>
                      View
                    </Button>
                  </Link>
                </article>
            ))}
          </div>
      </div>
    </section>
  )
}

export default RightSideBar