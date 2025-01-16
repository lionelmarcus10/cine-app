/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/jwt-actions';
import slugify from 'slugify';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/movie/{idSlug}:
 *   get:
 *     summary: Retrieve a movie by ID or slug
 *     tags: [Movie]
 *     description: Fetches a movie based on the provided ID or slug.
 *     parameters:
 *       - in: path
 *         name: idSlug
 *         required: true
 *         description: The unique identifier for the movie, either as an ID or a slug.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier for the movie.
 *                 title:
 *                   type: string
 *                   description: The title of the movie.
 *                 duration:
 *                   type: integer
 *                   description: The duration of the movie in minutes.
 *                 language:
 *                   type: string
 *                   description: The language of the movie.
 *                 ageLimit:
 *                   type: integer
 *                   description: The age limit for viewing the movie.
 *                 director:
 *                   type: string
 *                   description: The director of the movie.
 *                 slug:
 *                   type: string
 *                   description: A URL-friendly version of the movie title.
 *                 photo:
 *                   type: string
 *                   description: The URL of the movie's poster image.
 *                 video:
 *                   type: string
 *                   description: The video identifier for the movie.
 *                 synopsis:
 *                   type: string
 *                   description: A brief summary of the movie's plot.
 *                 screenings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier for the screening.
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                         description: The start time of the screening.
 *                       subtitle:
 *                         type: string
 *                         description: The subtitle language for the screening.
 *                       cinema:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: The unique identifier for the cinema.
 *                           name:
 *                             type: string
 *                             description: The name of the cinema.
 *                           city:
 *                             type: string
 *                             description: The city where the cinema is located.
 *                           address:
 *                             type: string
 *                             description: The address of the cinema.
 *                 actors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier for the actor.
 *                       name:
 *                         type: string
 *                         description: The name of the actor.
 *                       profile:
 *                         type: string
 *                         description: The URL of the actor's profile image.
 *       400:
 *         description: Invalid type parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid type parameter. Must be either "id" or "slug"
 *       404:
 *         description: Movie not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Movie not found
 *       500:
 *         description: Failed to fetch movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch movie
 */

export async function GET(
    request: Request,
    { params }: any
) {
    try {
        const identifier = (await params).id;
        // Determine if the identifier is a number or a slug
        const isNumeric = !isNaN(Number(identifier));
        const type = isNumeric ? 'id' : 'slug'; // default to 'id' if numeric, otherwise 'slug'

        const movie = await prisma.movie.findUnique({
            where: type === 'id' 
                ? { id: parseInt(identifier, 10) }
                : { slug: identifier },
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

        if (!movie) {
            return NextResponse.json(
                { error: 'Movie not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(movie);
    } catch (error) {
        console.error('Error fetching movie:', error);
        return NextResponse.json(
            { error: 'Failed to fetch movie' },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/movie/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movie]
 *     description: Deletes a movie based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the movie to be deleted.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authorization. Automatically set based on the security scheme.
 *         schema:
 *           type: string
 *           example: <your_token_here>
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie deleted successfully
 *       400:
 *         description: Invalid movie ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid movie ID
 *       401:
 *         description: Authorization token is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Authorization token is required
 *       403:
 *         description: Invalid or expired token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or expired token
 *       404:
 *         description: Movie not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Movie not found
 *       500:
 *         description: Failed to delete movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete movie
 *     security:
 *       - BearerAuth: []
 */

export async function DELETE(
    request: Request,
    { params }: any
) {

    
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



    const identifier = (await params).id;

    // Ensure the identifier is a number
    const movieId = parseInt(identifier, 10);
    if (isNaN(movieId)) {
        return NextResponse.json(
            { error: 'Invalid movie ID' },
            { status: 400 }
        );
    }

    // Attempt to delete the movie and all related screenings and actors
    try {
        // First, check if the movie exists
        const movieExists = await prisma.movie.findUnique({
            where: { id: movieId },
        });

        if (!movieExists) {
            return NextResponse.json(
                { error: 'Movie not found' },
                { status: 404 }
            );
        }

        // Then, delete the screenings associated with the movie
        await prisma.screening.deleteMany({
            where: { movieId: movieId },
        });

        // Finally, delete the movie itself
        await prisma.movie.delete({
            where: { id: movieId },
        });

        return NextResponse.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        return NextResponse.json(
            { error: 'Failed to delete movie' },
            { status: 500 }
        );
    }
}


/**
 * @swagger
 * /api/movie/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     tags: [Movie]
 *     description: Updates the details of a movie based on the provided ID. All fields are optional.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the movie to be updated.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: false
 *         description: The movie details to update. All fields are optional.
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: The title of the movie.
 *             duration:
 *               type: integer
 *               description: The duration of the movie in minutes.
 *             language:
 *               type: string
 *               description: The language of the movie.
 *             ageLimit:
 *               type: integer
 *               description: The age limit for the movie.
 *             director:
 *               type: string
 *               description: The director of the movie.
 *             photo:
 *               type: string
 *               description: The URL of the movie's poster.
 *             video:
 *               type: string
 *               description: The URL of the movie's video.
 *             synopsis:
 *               type: string
 *               description: A brief overview of the movie.
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie updated successfully
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Movie not found
 *       409:
 *         description: Slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Slug already exists
 *       500:
 *         description: Failed to update movie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update movie
 */


export async function PUT(request: Request, { params }: any ) {
    const identifier = (await params).id;

    // Ensure the identifier is a number
    const movieId = parseInt(identifier, 10);
    if (isNaN(movieId)) {
        return NextResponse.json(
            { error: 'Invalid movie ID' },
            { status: 400 }
        );
    }

    const body = await request.json();

    // Attempt to update the movie
    try {
        // First, check if the movie exists
        const movieExists = await prisma.movie.findUnique({
            where: { id: movieId },
        });

        if (!movieExists) {
            return NextResponse.json(
                { error: 'Movie not found' },
                { status: 404 }
            );
        }

        // Prepare the update data, only including fields that are provided
        const updateData: {
            title?: string;
            duration?: number;
            language?: string;
            ageLimit?: number;
            director?: string;
            photo?: string;
            video?: string;
            synopsis?: string;
            slug?: string;
        } = {};

        if (body.title !== undefined) {
            const newSlug = slugify(body.title);
            const existingSlug = await prisma.movie.findUnique({
                where: { slug: newSlug },
            });

            if (existingSlug) {
                // If the slug already exists, modify it to ensure uniqueness
                let slugSuffix = 1;
                let uniqueSlug = newSlug;

                while (await prisma.movie.findUnique({ where: { slug: uniqueSlug } })) {
                    uniqueSlug = `${newSlug}-${slugSuffix}`;
                    slugSuffix++;
                }

                updateData.slug = uniqueSlug; // Set the unique slug
            } else {
                updateData.slug = newSlug; // Set the new slug
            }
            updateData.title = body.title; // Update the title
        }
        if (body.duration !== undefined) updateData.duration = body.duration;
        if (body.language !== undefined) updateData.language = body.language;
        if (body.ageLimit !== undefined) updateData.ageLimit = body.ageLimit;
        if (body.director !== undefined) updateData.director = body.director;
        if (body.photo !== undefined) updateData.photo = body.photo;
        if (body.video !== undefined) updateData.video = body.video;
        if (body.synopsis !== undefined) updateData.synopsis = body.synopsis;

        // Update the movie details
        await prisma.movie.update({
            where: { id: movieId },
            data: updateData,
        });

        return NextResponse.json({ message: 'Movie updated successfully' });
    } catch (error) {
        console.error('Error updating movie:', error);
        return NextResponse.json(
            { error: 'Failed to update movie' },
            { status: 500 }
        );
    }
}