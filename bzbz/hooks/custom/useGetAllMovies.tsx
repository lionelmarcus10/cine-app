/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchMovies } from '@/app/actions/movie.action';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function useGetAllMovies(ImageBase: string) {

    const getMovies = async ({ pageParam }: { pageParam?: number }) => {
        const res = await fetchMovies(pageParam!);
        return res;
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['films'], // Include search in the query key
        queryFn: getMovies,
        initialPageParam: 1, // Start from page 1 instead of 0
        getNextPageParam: (lastPage) => {
            console.log(lastPage.totalPages, lastPage.Page)
            if (lastPage.totalPages > lastPage.Page) {
                return lastPage.Page + 1; // Return the next page number if available
            }
            return undefined; // No more pages
        },
    })



    useEffect(() => {
        if (hasNextPage) fetchNextPage();
    }, [data?.pages]);

    const hits = data?.pages.flatMap(page => 
        page.hits.map((movie: { photo: string; [key: string]: any }) => ({
            ...movie,
            photo: `${ImageBase}/${movie.photo}` // Add src property with the constructed URL
        }))
    ) || [];

    return hits ?? []

}
