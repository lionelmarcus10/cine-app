import React from 'react'
import { getMovieById } from '@/app/actions/movie.action'; // Adjust the import path as necessary
import { notFound } from 'next/navigation';

export default async function page({ params } : { params : { slug : string}}) {
  const slug = (await params).slug;
  let movie = await getMovieById(slug)
  if(movie.status == 200){
    movie = movie.data
  } else {
    return notFound()
  }

  return (
    <div>
      <p>individual movie (slug generator) </p>
      <pre>
        { JSON.stringify(movie, null, 2) }
      </pre>
    </div>
  );
}
