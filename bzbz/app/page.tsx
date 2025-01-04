/* eslint-disable @typescript-eslint/no-explicit-any */
import NavBar from '@/components/custom/NavBar';
import '../style/back.css'
import HomeGridImages from '@/components/custom/HomeGridImages';
import { fetchMovies } from './actions/movie.action';
import MovieCard from '@/components/custom/MovieCard';
import { Suspense } from 'react';

export default async function Page() {

  
  const {hits} = await fetchMovies(1)
  
  const img_base_url = `${process.env.TMDB_IMG_URL}/${process.env.TMDB_IMG_THUMB_SIZE}`
  return (
  <div className="h-screen w-full custom-bg mx-auto">
      <div className="wbf p-5 backdrop-blur-3xl w-full h-full flex items-center justify-center">
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
              <h1 className='text-2xl text-white'>Trending in Movies</h1>
              <div className="w-full grid gap-y-8 gap-x-4 xl:gap-8 grid-cols-1 min-[450px]:!grid-cols-2 sm:!grid-cols-3 md:!grid-cols-4 lg:!grid-cols-6 xl:!grid-cols-7 place-items-start">
                {hits.map((movie: any, index: number) => (
                  <Suspense key={index} fallback={<p>Loading...</p>}>
                    <MovieCard movie={movie} base={img_base_url} />
                  </Suspense>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>   
  );
}
