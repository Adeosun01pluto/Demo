"use client"
import React from 'react'

import { ThreeDots } from  'react-loader-spinner'


export default function Loading() {
  return (
    <div className='w-full flex justify-center text-white mt-16'>
      <ThreeDots 
        height="80" 
        width="80" 
        radius="9"
        color="#fff" 
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        // wrapperClassName=""
        visible={true}
        />
    </div>
  )
}
