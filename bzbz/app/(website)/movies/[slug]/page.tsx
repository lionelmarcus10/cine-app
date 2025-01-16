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
  const img_base_url = `${process.env.TMDB_IMG_URL}/${process.env.TMDB_IMG_THUMB_SIZE}`

  return (
      <div className="p-8 font-sans">
        <h1 className="text-3xl font-bold mb-6">{movie.title}</h1>
        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
          <img
            src={`${img_base_url}/${movie.photo}`}
            alt={`${movie.title} Poster`}
            className="w-full md:w-1/3 rounded-lg shadow-md"
          />
          <div className="flex-1 space-y-4">
            <p><span className="font-semibold">Director:</span> {movie.director}</p>
            <p><span className="font-semibold">Duration:</span> {movie.duration} minutes</p>
            <p><span className="font-semibold">Language:</span> {movie.language}</p>
            <p><span className="font-semibold">Age Limit:</span> {movie.ageLimit}+</p>
            <p><span className="font-semibold">Synopsis:</span> {movie.synopsis}</p>
          </div>
        </div>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Screenings</h2>
          {movie.screenings && movie.screenings.length > 0 ? (
            <ul className="space-y-4">
              {movie.screenings.map((screening: any) => (
                <li
                  key={screening.id}
                  className="p-4 bg-gray-100 rounded-lg shadow-md"
                >
                  <p><span className="font-semibold">Start Time:</span> {new Date(screening.startTime).toLocaleString()}</p>
                  <p><span className="font-semibold">Subtitle:</span> {screening.subtitle}</p>
                  <p><span className="font-semibold">Cinema:</span> {screening.cinema.name}, {screening.cinema.city}</p>
                  <p><span className="font-semibold">Address:</span> {screening.cinema.address}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No screenings available.</p>
          )}
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold mb-4">Actors</h2>
          {movie.actors && movie.actors.length > 0 ? (
            <ul className="flex flex-wrap gap-6">
              {movie.actors.map((actor: any) => (
                <li key={actor.id} className="flex flex-col items-center text-center">
                  <img
                    src={ actor.profile ? `${img_base_url}/${actor.profile}`: "https://www.ecranlarge.com/content/uploads/2022/05/spider-man-3-photo-1430956-630x380.jpg"}
                    alt={actor.name}
                    className="w-24 h-24 rounded-full object-cover shadow-md mb-2"
                  />
                  <p className="font-medium">{actor.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No actors listed.</p>
          )}
        </section>
      </div>
    );
}
