"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

function SearchTabs() {
  const [search, setSearch] = useState("")
  const router = useRouter();
  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${"search"}?q=` + search);
      } else {
        router.push(`/${"search"}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, router]);
  return (
    <div>
        <div className='searchbar'>
            <Image
            src='/assets/search-gray.svg'
            alt='search'
            width={24}
            height={24}
            className='object-contain'
            />
            <Input
            id='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${"search"}`}
            className='no-focus searchbar_input'
            />
        </div>        
    </div>
  )
}

export default SearchTabs

