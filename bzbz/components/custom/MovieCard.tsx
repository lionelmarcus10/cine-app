"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

export default function MovieCard({ movie } : { movie: any} ) {


  return (
    <Link target='_blank' className="col-span-1 w-full space-y-1 flex flex-col text-white transition-transform active:scale-95" href={`/movies/${movie.slug}`}>
        <div className="bg-white rounded-2xl">
            {movie.photo ? <Image src={movie.photo} alt={movie.title} width={200} height={250} className='w-full h-48 !object-cover rounded-xl' /> : <p>No image available</p>}
        </div>
        <div className="pt-2">
            <p className='line-clamp-1'>{movie.title}</p>
        </div>
        <p className='whitespace-nowrap'><span className='text-xs'>{'⭐'.repeat(Math.ceil(Math.random() * 5))}</span> | {movie.duration} min</p>
    </Link>
  )
}
