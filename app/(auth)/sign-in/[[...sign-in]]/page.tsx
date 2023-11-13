// "use client"
import { SignIn } from "@clerk/nextjs";
import { Cloud } from "lucide-react";
 
export default function Page() {
  return <div className="w-full flex items-center py-6 justify-center min-h-screen">
    <SignIn />
  </div> 
  
}

// import React, { useState } from 'react'

// export default function page() {
//   const [email, setEmail] = useState<String>("")
//   const [password, setPassword] = useState<String>("")

//   const submit = async () =>{
//     console.log(email, password)
//   }

//   return (
//     <div className='w-full h-[100vh]  flex items-center justify-center '>
//       <SignIn />;
//       <div className='bg-[#1f1f1f] p-8 w-[30%] h-[85vh] rounded-lg mx-auto'>
//         <div>
//           <p className="text-white text-[22px] font-semibold">Sign in</p>
//           <p className="text-gray-200 py-2">to continue to Echominds</p>
//         </div>
//         <div className="my-5">
//           <button className="border flex items-center rounded-md p-2 w-full text-[13px] text-white  border-gray-600">
//             <Cloud />
//             <span className="flex-1">Continue with Google</span>
//           </button>

//           <p className="text-white text-center my-6">or</p>
//         </div>

//         <div className="flex flex-col gap-3">
//           <div className="flex flex-col gap-2">
//             <label htmlFor="" className="text-white text-[13px]">Email address or username</label>
//             {/* @ts-ignore */}
//             <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" placeholder="Email address" className="px-3 py-2 text-[13px] rounded-md border border-gray-600 text-white bg-transparent w-full " />
//           </div>
//           <div className="flex flex-col gap-2">
//             <label htmlFor="" className="text-white text-[13px]">Password</label>
//             {/* @ts-ignore */}
//             <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="px-3 py-2 text-[13px] rounded-md border border-gray-600 text-white bg-transparent w-full " />
//           </div>
//           <button onClick={submit} className="bg-primary-500 text-white py-2 px-5 text-center text-[15px] rounded-md my-2">Continue</button>
//           <div className="text-white text-[13px]">
//             <span>No account? </span> {' '} <span className="text-primary-500">Sign Up</span>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }
