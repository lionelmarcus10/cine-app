/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchMovies, searchMovies } from '@/app/actions/movie.action';
import { useIntersection } from '@/hooks/custom/UseInteraction';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { Suspense, useEffect, useRef } from 'react'
import MovieCard from './MovieCard';
import { useQueryState } from 'nuqs';

export default function MoviesInfiniteScroll( { ImageBase, search}: { ImageBase : string, search: boolean } ) {

    const [searchParam] = useQueryState('value')

    // get all films,  
    const getMovies = async ({ pageParam }: { pageParam?: number }) => {
        console.log(pageParam)
        const res = search ? await searchMovies(pageParam, searchParam ?? "Paris" ) : await fetchMovies(pageParam);
        console.log(res)
        return res;
    }

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['films', search], // Include search in the query key
        queryFn: getMovies,
        initialPageParam: 1, // Start from page 1 instead of 0
        getNextPageParam: (lastPage) => {
            if (lastPage.totalPages > lastPage.Page) {
                return lastPage.Page + 1; // Return the next page number if available
            }
            return undefined; // No more pages
        },
    })

    const endView = useRef<HTMLDivElement>(null);
    const { ref, entry } = useIntersection({
        root: endView.current,
        threshold: 1,
    });

    useEffect(() => {
        if (entry?.isIntersecting && data && hasNextPage) fetchNextPage();
    }, [entry]);

    const hits = data?.pages.flatMap(page => 
        page.hits.map(movie => ({
            ...movie,
            photo: `${ImageBase}/${movie.photo}` // Add src property with the constructed URL
        }))
    ) || [];


  return (
    <div className="">
        {/* <h1 className='text-2xl text-white'>Trending in Movies</h1> */}
        <div className="w-full grid gap-y-8 gap-x-4 xl:gap-8 grid-cols-1 min-[450px]:!grid-cols-2 sm:!grid-cols-3 md:!grid-cols-4 lg:!grid-cols-6 xl:!grid-cols-7 place-items-start">
        {hits.map((movie: any, index: number) => (
            <Suspense key={index} fallback={<p>Loading...</p>}>
                <MovieCard movie={movie} />
            </Suspense>
        ))}
        {hasNextPage ? <div ref={ref}></div> :  <></>}
        </div>
    </div>
  )
}
