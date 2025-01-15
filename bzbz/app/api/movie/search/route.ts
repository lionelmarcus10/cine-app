import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/movie/search:
 *   get:
 *     summary: Search for movies
 *     tags: [Search]
 *     parameters:
 *       - name: search
 *         in: query
 *         required: true
 *         description: The search term to filter movies by title, actor name, or cinema city.
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: A list of movies matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the movie.
 *                       title:
 *                         type: string
 *                         description: The title of the movie.
 *                       duration:
 *                         type: integer
 *                         description: The duration of the movie in minutes.
 *                       photo:
 *                         type: string
 *                         description: The URL of the movie's poster image.
 *                 Page:
 *                   type: integer
 *                   description: The current page number.
 *                 totalItem:
 *                   type: integer
 *                   description: The total number of items found.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages available.
 *                 ItemPerPage:
 *                   type: integer
 *                   description: The number of items per page.
 *       400:
 *         description: Bad request if the search parameter is missing.
 *       500:
 *         description: Internal server error if something goes wrong.
 */

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const searchString = searchParams.get('search'); // Single search parameter
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 30; // Set limit to 30 as per instructions
    const skip = (page - 1) * limit;

    if (!searchString) {
        return NextResponse.json(
            { error: 'Search parameter is required' },
            { status: 400 }
        );
    }

    try {
        const movies = await prisma.movie.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: searchString,
                        },
                    },
                    {
                        screenings: {
                            some: {
                                cinema: {
                                    city: {
                                        contains: searchString,
                                    },
                                },
                            },
                        },
                    },
                    {
                        actors: {
                            some: {
                                name: {
                                    contains: searchString,
                                },
                            },
                        },
                    },
                    {
                        screenings: {
                            some: {
                                cinema: {
                                    name: {
                                        contains: searchString,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            skip: skip,
            take: limit,
            include: {
                screenings: {
                    select: {
                        id: true, 
                        startTime: true,
                        subtitle: true,
                        cinema: true
                    },
                },
                actors: true,
            },
        });

        // Remove duplicates based on movie ID
        const uniqueMovies = Array.from(new Map(movies.map(movie => [movie.id, movie])).values());

        const totalMovies = uniqueMovies.length; // Update totalMovies to reflect unique count

        return NextResponse.json({
            hits: movies,
            Page: page,
            totalItem: totalMovies,
            totalPages: Math.ceil(totalMovies / limit),
            ItemPerPage: limit,
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
    }
}
