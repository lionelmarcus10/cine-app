/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @swagger
 * components:
 *   schemas:
 *     WelcomeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Welcome message for the API.
 *           example: Welcome to the API
 * 
 * /api:
 *   get:
 *     summary: Welcome message
 *     tags: [Welcome]
 *     description: Returns a welcome message for the API.
 *     responses:
 *       200:
 *         description: Successful response with welcome message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WelcomeResponse'
 */

export async function GET(request: Request) {
    return Response.json({ message: "Welcome to the API" });
}
