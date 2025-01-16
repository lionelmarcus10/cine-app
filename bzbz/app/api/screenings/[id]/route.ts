/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/jwt-actions';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/screenings/{id}:
 *   get:
 *     summary: Retrieve a screening by ID
 *     tags: [Screenings]
 *     description: Fetches a screening based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the screening.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A screening object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 movieId:
 *                   type: integer
 *                 cinemaId:
 *                   type: integer
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 subtitle:
 *                   type: string
 *                 movie:
 *                   type: object
 *                   properties:
 *                     slug:
 *                       type: string
 *                       description: The URL-friendly version of the movie title.
 *                     title:
 *                       type: string
 *                       description: The title of the movie.
 *                 cinema:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                       description: The address of the cinema.
 *                     city:
 *                       type: string
 *                       description: The city where the cinema is located.
 *                     name:
 *                       type: string
 *                       description: The name of the cinema.
 *       404:
 *         description: Screening not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Screening not found
 *       500:
 *         description: Failed to fetch screening
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch screening
 */
export async function GET(request: Request, { params }: any ) {
    const identifier = (await params).id;

    try {
        const screening = await prisma.screening.findUnique({
            where: { id: parseInt(identifier, 10) },
            include: {
                movie: {
                    select: {
                        slug: true,
                        title: true,
                    }
                },
                cinema: {
                    select: {
                        address: true,
                        city: true,
                        name: true,
                    }
                },
            },
        });
        
        if (!screening) {
            return NextResponse.json(
                { error: 'Screening not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(screening);
    } catch (error) {
        console.error('Error fetching screening:', error);
        return NextResponse.json(
            { error: 'Failed to fetch screening' },
            { status: 500 }
        );
    }
}




/**
 * @swagger
 * /api/screenings/{id}:
 *   put:
 *     summary: Update a screening by ID
 *     tags: [Screenings]

 *     description: Updates a screening based on the provided ID. All fields are optional.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the screening.
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authorization
 *         schema:
 *           type: string
 *           example: Bearer <your_token_here>
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: The ID of the movie associated with the screening.
 *               cinemaId:
 *                 type: integer
 *                 description: The ID of the cinema where the screening takes place.
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: The start time of the screening.
 *               subtitle:
 *                 type: string
 *                 description: The subtitle language for the screening.
 *     responses:
 *       200:
 *         description: Screening updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Screening updated successfully
 *       404:
 *         description: Screening not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Screening not found
 *       500:
 *         description: Failed to update screening
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update screening
 *     security:
 *       - BearerAuth: []
 */
export async function PUT(request: Request, { params }: any ) {
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
    const body = await request.json();

    try {
        const screening = await prisma.screening.findUnique({
            where: { id: parseInt(identifier, 10) },
        });

        if (!screening) {
            return NextResponse.json(
                { error: 'Screening not found' },
                { status: 404 }
            );
        }
        const updatedData = {
            movieId: body.movieId !== undefined ? body.movieId : screening.movieId,
            cinemaId: body.cinemaId !== undefined ? body.cinemaId : screening.cinemaId,
            startTime: body.startTime ? new Date(body.startTime) : screening.startTime,
            subtitle: body.subtitle !== undefined ? body.subtitle : screening.subtitle,
        };

        await prisma.screening.update({
            where: { id: parseInt(identifier, 10) },
            data: updatedData,
        });

        return NextResponse.json({ message: 'Screening updated successfully' });
    } catch (error) {
        console.error('Error updating screening:', error);
        return NextResponse.json(
            { error: 'Failed to update screening' },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/screenings/{id}:
 *   delete:
 *     summary: Delete a screening by ID
 *     tags: [Screenings]
 *     description: Deletes a screening based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the screening to be deleted.
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authorization
 *         schema:
 *           type: string
 *           example: Bearer <your_token_here>
 *     responses:
 *       200:
 *         description: Screening deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Screening deleted successfully
 *       404:
 *         description: Screening not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Screening not found
 *       500:
 *         description: Failed to delete screening
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete screening
 *     security:
 *       - BearerAuth: []
 */
export async function DELETE(request: Request, { params }: any ) {
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

    try {
        const screeningExists = await prisma.screening.findUnique({
            where: { id: parseInt(identifier, 10) },
        });

        if (!screeningExists) {
            return NextResponse.json(
                { error: 'Screening not found' },
                { status: 404 }
            );
        }

        await prisma.screening.delete({
            where: { id: parseInt(identifier, 10) },
        });

        return NextResponse.json({ message: 'Screening deleted successfully' });
    } catch (error) {
        console.error('Error deleting screening:', error);
        return NextResponse.json(
            { error: 'Failed to delete screening' },
            { status: 500 }
        );
    }
}

