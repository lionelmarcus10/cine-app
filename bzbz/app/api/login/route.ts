import { createJWT } from "@/lib/jwt-actions";
import { isValidEmail, isValidPassword } from "@/lib/utils";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";



/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password.
 *           example: Password123=
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token for authenticated user.
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         error:
 *           type: string
 *           description: Error message if authentication fails.
 *           example: Invalid email or password
 * 
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */

export async function POST(request: Request) {
  // Read data off req body
  const body = await request.json();
  const { email, password } = body;
  // Validate data
  if (!isValidEmail(email) || !isValidPassword(password)) {
    return Response.json(
      {
        error: "Invalid email or password",
      },
      { status: 400 }
    );
  }

  // Lookup the user
  const user = await prisma.administrator.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return Response.json(
      {
        error: "Invalid email or password",
      },
      { status: 400 }
    );
  }

  // Compare password
  const isCorrectPassword = bcrypt.compareSync(password, user.password);

  if (!isCorrectPassword) {
    return Response.json(
      {
        error: "Invalid email or password",
      },
      { status: 400 }
    );
  }

  // Create jwt token
  const jwt = await createJWT(user)
  // Respond with it
  return Response.json({ token: jwt });
}