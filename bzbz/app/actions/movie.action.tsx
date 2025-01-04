"use server";

export async function fetchMovies(page: number) {
    if (typeof page !== 'number' || page <= 0) {
        return {
            error: 'Page must be a positive number',
            status: 400
        };
    }

    try {
        const res = await fetch(`http://localhost:3000/api/movie?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            return {
                error: errorData.error || 'Failed to fetch movies',
                status: res.status
            };
        }

        const data = await res.json();
        return {
            hits: data.hits,
            Page: data.Page,
            totalItem: data.totalItem,
            totalPages: data.totalPages,
            ItemPerPage: data.ItemPerPage,
            status: 200
        };
    } catch (error) {
        console.error('Error fetching movies:', error);
        return {
            error: 'Failed to fetch movies',
            status: 500
        };
    }
}

