"use client"
import React, { useState } from 'react'
import AuthIcon from '@/components/custom/AuthIcon';
import { Search } from 'lucide-react';
import { useQueryState } from 'nuqs';


export default function NavBar() {

  const [searchParam, setSearchParam] = useQueryState('value')
  const [inputVal, setInputVal] = useState(searchParam ?? "")
  const [searchMode, setSearchMode] = useQueryState('searchMode')
  
  return (
    <div className="flex justify-between items-center sticky top-0">
        <div className="">
            <p className='text-white text-2xl font-bold'>Flix.id</p>
        </div>
        <div className="rounded-full h-10 flex items-center bg-[#010e1c] p-2">
            <input type="text" placeholder='Search a movie' value={inputVal} onChange={e => {
              setInputVal(e.target.value)
            }}
             className='placeholder:text-neutral-500  outline-none text-sm placeholder:text-sm text-white bg-[#010e1c] w-44 pl-4' />
            <div className="ml-2 bg-[#1b2733] h-8 flex items-center justify-center p-2 rounded-full relative" onClick={()=> {
               if (searchMode !== 'true') {
                setSearchMode('true');
              } 
              setSearchParam(inputVal)
            }}>
            <Search className='text-white' width={16} height={16} />
            </div>
        </div>
        <AuthIcon />
    </div>
  )
}
