import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/actors/{id}:
 *   get:
 *     summary: Retrieve an actor by ID
 *     tags: [Actor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the actor.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Actor retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       404:
 *         description: Actor not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Actor not found
 *       400:
 *         description: Invalid actor ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid actor ID
 */

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const authToken = (request.headers.get('Authorization') || '').split("Bearer ").at(1);
    if (!authToken) {
        return NextResponse.json(
            { error: 'Authorization token is required' },
            { status: 401 }
        );
    }

    const actorId = parseInt(params.id, 10);

    if (isNaN(actorId)) {
        return NextResponse.json(
            { error: 'Invalid actor ID' },
            { status: 400 }
        );
    }

    try {
        const actor = await prisma.actor.findUnique({
            where: { id: actorId },
        });

        if (!actor) {
            return NextResponse.json(
                { error: 'Actor not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(actor, { status: 200 });
    } catch (error) {
        console.error('Error fetching actor by ID:', error);
        return NextResponse.json(
            { error: 'Failed to fetch actor' },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/actors/{id}:
 *   put:
 *     summary: Update an actor by ID
 *     tags: [Actor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the actor.
 *         schema:
 *           type: integer
 *           example: 1
        - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authorization. Automatically set based on the security scheme.
 *         schema:
 *           type: string
 *           example: <your_token_here>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Actor Name"
 *               profile:
 *                 type: string
 *                 example: "https://example.com/updated-profile.jpg"
 *     responses:
 *       200:
 *         description: Actor updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       400:
 *         description: Missing required fields or invalid actor ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 *       404:
 *         description: Actor not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Actor not found
 *       500:
 *         description: Failed to update actor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update actor
*        security:
*       - BearerAuth: []
*/

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const authToken = (request.headers.get('Authorization') || '').split("Bearer ").at(1);
    if (!authToken) {
        return NextResponse.json(
            { error: 'Authorization token is required' },
            { status: 401 }
        );
    }

    const actorId = parseInt(params.id, 10);
    const body = await request.json();
    const { name, profile } = body;

    if (isNaN(actorId)) {
        return NextResponse.json(
            { error: 'Invalid actor ID' },
            { status: 400 }
        );
    }

    if (!name) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    try {
        const updatedActor = await prisma.actor.update({
            where: { id: actorId },
            data: {
                name,
                profile: profile ? profile : null,
            },
        });

        return NextResponse.json(updatedActor, { status: 200 });
    } catch (error) {
        console.error('Error updating actor:', error);
        return NextResponse.json(
            { error: 'Failed to update actor' },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/actors/{id}:
 *   delete:
 *     summary: Delete an actor by ID
 *     tags: [Actor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the actor.
 *         schema:
 *           type: integer
 *           example: 1
        - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authorization. Automatically set based on the security scheme.
 *         schema:
 *           type: string
 *           example: <your_token_here>
 *     responses:
 *       200:
 *         description: Actor deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       404:
 *         description: Actor not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Actor not found
 *       400:
 *         description: Invalid actor ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid actor ID
 *       500:
 *         description: Failed to delete actor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete actor
 *        security:
 *       - BearerAuth: []
 */

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const authToken = (request.headers.get('Authorization') || '').split("Bearer ").at(1);
    if (!authToken) {
        return NextResponse.json(
            { error: 'Authorization token is required' },
            { status: 401 }
        );
    }

    const actorId = parseInt(params.id, 10);

    if (isNaN(actorId)) {
        return NextResponse.json(
            { error: 'Invalid actor ID' },
            { status: 400 }
        );
    }

    try {
        const deletedActor = await prisma.actor.delete({
            where: { id: actorId },
        });

        return NextResponse.json(deletedActor, { status: 200 });
    } catch (error) {
        console.error('Error deleting actor:', error);
        return NextResponse.json(
            { error: 'Failed to delete actor' },
            { status: 500 }
        );
    }
}
