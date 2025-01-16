import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/jwt-actions';

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Actor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the actor.
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the actor.
 *           example: "Leonardo DiCaprio"
 *         profile:
 *           type: string
 *           description: The URL of the actor's profile image.
 *           example: "https://example.com/profile.jpg"
 * /api/actors:
 *   post:
 *     summary: Create a new actor
 *     tags: [Actor]
 *     description: Creates a new actor with the provided details. Requires admin authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the actor
 *                 example: "Leonardo DiCaprio"
 *               profile:
 *                 type: string
 *                 description: URL of the actor's profile image
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       201:
 *         description: Actor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create actor
 *   get:
 *     summary: Retrieve a list of actors
 *     tags: [Actor]
 *     description: Fetches a list of all actors.
 *     responses:
 *       200:
 *         description: A list of actors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Actor'
 *       500:
 *         description: Failed to fetch actors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch actors
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
    const { name, profile } = body;

    if (!name) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    try {
        const newActor = await prisma.actor.create({
            data: {
                name,
                profile: profile ? profile : null,
                id: parseInt(Date.now().toString()), // Automatically assign a unique integer ID based on the current timestamp
            },
        });

        return NextResponse.json(newActor, { status: 201 });
    } catch (error) {
        console.error('Error creating actor:', error);
        return NextResponse.json(
            { error: 'Failed to create actor' },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/actors:
 *   get:
 *     summary: Retrieve a paginated list of actors
 *     tags: [Actor]
 *     description: Fetches a list of actors with pagination support.
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
 *         description: A list of actors with pagination information.
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
 *                         description: The unique identifier for the actor.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The name of the actor.
 *                         example: "Leonardo DiCaprio"
 *                       profile:
 *                         type: string
 *                         description: The URL of the actor's profile image.
 *                         example: "https://example.com/profile.jpg"
 *                 Page:
 *                   type: integer
 *                   description: The current page number.
 *                   example: 1
 *                 totalItem:
 *                   type: integer
 *                   description: The total number of actors available.
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages available.
 *                   example: 4
 *                 ItemPerPage:
 *                   type: integer
 *                   description: The number of items per page.
 *                   example: 30
 *       500:
 *         description: Failed to fetch actors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch actors
 */

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 30; // Set limit to 30 as per instructions
    const skip = (page - 1) * limit;

    try {
        const actors = await prisma.actor.findMany({
            skip: skip,
            take: limit,
        });

        const totalActors = await prisma.actor.count();

        return NextResponse.json({
            hits: actors,
            Page: page,
            totalItem: totalActors,
            totalPages: Math.ceil(totalActors / limit),
            ItemPerPage: limit,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching actors:', error);
        return NextResponse.json({ error: 'Failed to fetch actors' }, { status: 500 });
    }
}
