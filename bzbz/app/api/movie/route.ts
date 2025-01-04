import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/jwt-actions';

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     MoviesResponse:
 *       type: object
 *       properties:
 *         hits:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The unique identifier for the movie.
 *                 example: 68
 *               title:
 *                 type: string
 *                 description: The title of the movie.
 *                 example: Brazil
 *               duration:
 *                 type: integer
 *                 description: The duration of the movie in minutes.
 *                 example: 143
 *               language:
 *                 type: string
 *                 description: The language of the movie.
 *                 example: en
 *               ageLimit:
 *                 type: integer
 *                 description: The age limit for viewing the movie.
 *                 example: 0
 *               director:
 *                 type: string
 *                 description: The director of the movie.
 *                 example: Terry Gilliam
 *               slug:
 *                 type: string
 *                 description: A URL-friendly version of the movie title.
 *                 example: Brazil
 *               photo:
 *                 type: string
 *                 description: The URL of the movie's poster image.
 *                 example: /2w09J0KUnVtJvqPYu8N63XjAyCR.jpg
 *               video:
 *                 type: string
 *                 description: The video identifier for the movie.
 *                 example: A_7ATU9dslE
 *               synopsis:
 *                 type: string
 *                 description: A brief summary of the movie's plot.
 *                 example: Low-level bureaucrat Sam Lowry escapes the monotony of his day-to-day life through a recurring daydream of himself as a virtuous hero saving a beautiful damsel...
 *               screenings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The unique identifier for the screening.
 *                       example: 13007
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       description: The start time of the screening.
 *                       example: 2025-11-04T09:32:11.021Z
 *                     subtitle:
 *                       type: string
 *                       description: The subtitle language for the screening.
 *                       example: Hebrew
 *                     cinema:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: The unique identifier for the cinema.
 *                           example: 19351687
 *                         name:
 *                           type: string
 *                           description: The name of the cinema.
 *                           example: Johnston - Wisozk
 *                         city:
 *                           type: string
 *                           description: The city where the cinema is located.
 *                           example: Cannes
 *                         address:
 *                           type: string
 *                           description: The address of the cinema.
 *                           example: 1970 Stuart Square
 *               actors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The unique identifier for the actor.
 *                       example: 65
 *                     name:
 *                       type: string
 *                       description: The name of the actor.
 *                       example: Ian Holm
 *                     profile:
 *                       type: string
 *                       description: The URL of the actor's profile image.
 *                       example: https://media.themoviedb.org/t/p/cOJDgvgj4nMec6Inzj1H5nugTO5.jpg
 *         Page:
 *           type: integer
 *           description: The current page number.
 *           example: 1
 *         totalItem:
 *           type: integer
 *           description: The total number of movies available.
 *           example: 100
 *         totalPages:
 *           type: integer
 *           description: The total number of pages available.
 *           example: 4
 *         ItemPerPage:
 *           type: integer
 *           description: The number of items per page.
 *           example: 30
 * 
 * /api/movie:
 *   get:
 *     summary: Retrieve a paginated list of movies
 *     description: Fetches a list of movies with pagination support.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number to retrieve (default is 1).
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of movies with pagination information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MoviesResponse'
 *       500:
 *         description: Failed to fetch movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch movies
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 30; // Set limit to 30 as per instructions
    const skip = (page - 1) * limit;

    try {
        const movies = await prisma.movie.findMany({
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

        const totalMovies = await prisma.movie.count();

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



/**
 * @swagger
 * /api/movie:
 *   post:
 *     summary: Create a new movie
 *     description: Creates a new movie with the provided details. Requires admin authentication.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authorization
 *         schema:
 *           type: string
 *           example: Bearer <your_token_here>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *               - language
 *               - director
 *               - synopsis
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the movie
 *                 example: "Inception"
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *                 example: 148
 *               language:
 *                 type: string
 *                 description: Original language of the movie
 *                 example: "en"
 *               ageLimit:
 *                 type: integer
 *                 description: Age restriction for the movie
 *                 example: 12
 *               director:
 *                 type: string
 *                 description: Name of the movie director
 *                 example: "Christopher Nolan"
 *               synopsis:
 *                 type: string
 *                 description: Plot summary of the movie
 *                 example: "A thief who enters the dreams of others..."
 *               photo:
 *                 type: string
 *                 description: URL of the movie poster
 *                 example: "/path/to/poster.jpg"
 *               video:
 *                 type: string
 *                 description: Video trailer identifier
 *                 example: "dQw4w9WgXcQ"
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 duration:
 *                   type: integer
 *                 language:
 *                   type: string
 *                 ageLimit:
 *                   type: integer
 *                 director:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 photo:
 *                   type: string
 *                 video:
 *                   type: string
 *                 synopsis:
 *                   type: string
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Authorization token is required
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Movie already exists
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or expired token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create movie
 *     security:
 *       - BearerAuth: []
 */

export async function POST(request: Request) {
    const authToken = (request.headers.get('Authorization') || '').split("Bearer ").at(1);
    if (!authToken) {
        return NextResponse.json(
            { error: 'Authorization token is required' },
            { status: 401 }
        );
    }

    const session = await verifyJWT(authToken);
    if (!session) {
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 403 }
        );
    }

    const body = await request.json();

    const { title, duration, language, ageLimit, director, synopsis, photo, video } = body;

    // Validate required fields
    if (!title || !duration || !language || !director || !synopsis) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    // Ensure duration and ageLimit are integers
    const parsedDuration = parseInt(duration, 10);
    const parsedAgeLimit = parseInt(ageLimit, 10);

    if (isNaN(parsedDuration) || isNaN(parsedAgeLimit)) {
        return NextResponse.json(
            { error: 'Duration and age limit must be integers' },
            { status: 400 }
        );
    }
    const existingMovie = await prisma.movie.findFirst({
        where: { title },
    });

    if (existingMovie) {
        return NextResponse.json(
            { error: 'Movie already exists' },
            { status: 409 }
        );
    }
    
    try {
        // Generate a unique ID for the movie
        const uniqueId = await prisma.movie.count() + 1; // Simple unique ID generation

        // Generate a unique slug for the movie
        let uniqueSlug = title.replace(/\s+/g, '-').toLowerCase(); // Basic slug generation
        let slugSuffix = 1;

        // Ensure the slug is unique
        while (await prisma.movie.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${title.replace(/\s+/g, '-').toLowerCase()}-${slugSuffix}`;
            slugSuffix++;
        }

        // Create the movie
        const newMovie = await prisma.movie.create({
            data: {
                id: uniqueId, // Assign the generated unique ID
                title,
                duration: parsedDuration, // Use parsed duration
                language,
                ageLimit: parsedAgeLimit || 0, // Use parsed age limit, default to 0 if not provided
                director,
                slug: uniqueSlug, // Assign the unique slug
                photo: photo || null, // Allow photo to be null if not specified
                video: video || null, // Allow video to be null if not specified
                synopsis,
            },
        });

        return NextResponse.json(newMovie, { status: 201 });
    } catch (error) {
        console.error('Error creating movie:', error);
        return NextResponse.json(
            { error: 'Failed to create movie' },
            { status: 500 }
        );
    }
}