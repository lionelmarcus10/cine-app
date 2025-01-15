/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useQueryState, parseAsBoolean } from 'nuqs'
import React from 'react'
import HomeGridImages from './HomeGridImages'
import NavBar from './NavBar'
import { Switch } from '../ui/switch';
import MoviesInfiniteScroll from './MoviesInfiniteScroll';

export default function HomeLayout({ ImageBase}: { ImageBase : string }) {
    
    // get display
    const [searchMode, setSearchMode] = useQueryState('searchMode', parseAsBoolean.withDefault(false))
    
  return (
    <div className=" bg-[#899296] overflow-y-auto relative invisible-scrollbar backdrop-blur-3xl shadow-xl sm:w-10/12 md:h-5/6 w-full h-full rounded-3xl p-5 flex flex-col space-y-6 z-10">
        <NavBar/>
        <div className="h-full">
        <HomeGridImages />
        <div className="mt-5 mb-8 flex  overflow-y-hidden invisible-scrollbar space-x-5 pr-4">
            {Array.from({ length: 30 }, (_, index) => (
            <p key={index} className="border rounded-xl h-11 w-56 px-5 shadow-xl text-nowrap py-2">Category {index + 1}</p>
            ))}
        </div>
        <div className="w-full pb-10 space-y-4">
            <div className="flex items-center space-x-3">
                <h1 className='text-2xl text-white max-w-52 !w-52'>{searchMode ? "Results" : "Trending in Movies" }</h1>

                <Switch
                    checked={searchMode}
                    onCheckedChange={setSearchMode}
                    aria-label="Toggle between default layout and search results"
                />

            </div>
            <MoviesInfiniteScroll search={searchMode} ImageBase={ImageBase} />
            
        </div>
        </div>
    </div>
  )
}
