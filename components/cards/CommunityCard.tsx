import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  description: string;
  members: {
    image: string;
  }[];
}

function CommunityCard({ id, name, username, imgUrl, description, members }: Props) {
  const maxLength = 185;
  // Check if the description is longer than the maximum length
  const truncatedDescription = description.length > maxLength
  ? `${description.slice(0, maxLength)}...`
  : description;
  return (
    <article className='community-card'>
      <div className='flex flex-wrap items-center gap-3'>
        <Link href={`/communities/${id}`} className='relative h-12 w-12'>
          {imgUrl?
            <Image
            src={imgUrl}
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
          <Link href={`/communities/${id}`}>
            <h4 className='text-base-semibold dark:text-dark-1 text-light-1'>{name}</h4>
          </Link>
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>
      <div className="flex-1">
        <p className='mt-4 text-subtle-medium text-gray-1'>{truncatedDescription}</p>
      </div>

      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
        <Link href={`/communities/${id}`}>
          <Button size='sm' className='community-card_btn'>
            View
          </Button>
        </Link>

        {members.length > 0 && (
          <div className='flex items-center'>
            {members.map((member, index) => (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={28}
                height={28}
                className={`${
                  index !== 0 && "-ml-2"
                } rounded-full object-cover`}
              />
            ))}
            {members.length > 3 && (
              <p className='ml-1 text-subtle-medium text-gray-1'>
                {members.length}+ Users
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default CommunityCard;