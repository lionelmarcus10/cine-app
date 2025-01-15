import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/jwt-actions';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/screenings:
 *   get:
 *     summary: Retrieve a paginated list of screenings
 *     tags: [Screenings]
 *     description: Fetches a paginated list of all screenings available in the database.
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
 *         description: A paginated list of screenings
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
 *                         description: The unique identifier for the screening.
 *                         example: 12801
 *                       movieId:
 *                         type: integer
 *                         description: The ID of the movie associated with the screening.
 *                         example: 672
 *                       cinemaId:
 *                         type: integer
 *                         description: The ID of the cinema where the screening takes place.
 *                         example: 73749591
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                         description: The start time of the screening.
 *                         example: 2025-09-30T14:40:46.710Z
 *                       subtitle:
 *                         type: string
 *                         description: The subtitle language for the screening.
 *                         example: Irish
 *                       movie:
 *                         type: object
 *                         properties:
 *                           slug:
 *                             type: string
 *                             description: The URL-friendly version of the movie title.
 *                             example: Harry-Potter-and-the-Chamber-of-Secrets
 *                           title:
 *                             type: string
 *                             description: The title of the movie.
 *                             example: Harry Potter and the Chamber of Secrets
 *                       cinema:
 *                         type: object
 *                         properties:
 *                           address:
 *                             type: string
 *                             description: The address of the cinema.
 *                             example: 113 Braulio Fields
 *                           city:
 *                             type: string
 *                             description: The city where the cinema is located.
 *                             example: Sarcelles
 *                           name:
 *                             type: string
 *                             description: The name of the cinema.
 *                             example: Rempel - Durgan
 *                 Page:
 *                   type: integer
 *                   description: The current page number.
 *                   example: 1
 *                 totalItem:
 *                   type: integer
 *                   description: The total number of screenings available.
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages available.
 *                   example: 4
 *                 ItemPerPage:
 *                   type: integer
 *                   description: The number of items per page.
 *                   example: 30
 *     security:
 *       - BearerAuth: []
 */

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 30; // Set limit to 30
    const skip = (page - 1) * limit;

    try {
        const screenings = await prisma.screening.findMany({
            skip: skip,
            take: limit,
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

        const totalScreenings = await prisma.screening.count();

        return NextResponse.json({
            hits: screenings,
            Page: page,
            totalItem: totalScreenings,
            totalPages: Math.ceil(totalScreenings / limit),
            ItemPerPage: limit,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching screenings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch screenings' },
            { status: 500 }
        );
    }
}



/**
 * @swagger
 * /api/screenings:
 *   post:
 *     summary: Create a new screening
 *     tags: [Screenings]
 *     description: Creates a new screening with the provided details. Requires admin authentication.
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
 *               - movieId
 *               - cinemaId
 *               - startTime
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
 *       201:
 *         description: Screening created successfully
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
 *                   example: Failed to create screening
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
    const { movieId, cinemaId, startTime, subtitle } = body;
    // Validate required fields
    if (!movieId || !cinemaId || !startTime || !subtitle) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    try {
        const newScreening = await prisma.screening.create({
            data: {
                movieId,
                cinemaId,
                startTime: new Date(startTime),
                subtitle: subtitle
            },
        });
        console.log("ddd",newScreening)
        return NextResponse.json(newScreening, { status: 201 });
    } catch (error) {
        console.error('Error creating screening:', error);
        return NextResponse.json(
            { error: 'Failed to create screening' },
            { status: 500 }
        );
    }
}