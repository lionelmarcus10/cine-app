import React from 'react'
import AuthIcon from '@/components/custom/AuthIcon';
import { Search } from 'lucide-react';


export default function NavBar() {
  return (
    <div className="flex justify-between items-center sticky top-0">
        <div className="">
            <p className='text-white text-2xl font-bold'>Flix.id</p>
        </div>
        <div className="rounded-full h-10 flex items-center bg-[#010e1c] p-2">
            <input type="text" placeholder='Search a movie' className='placeholder:text-neutral-500  outline-none text-sm placeholder:text-sm text-white bg-[#010e1c] w-44 pl-4' />
            <div className="ml-2 bg-[#1b2733] h-8 flex items-center justify-center p-2 rounded-full relative">
            <Search className='text-white' width={16} height={16} />
            </div>
        </div>
        <AuthIcon />
    </div>
  )
}
