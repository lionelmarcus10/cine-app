import { isValidEmail, isValidPassword } from "@/lib/utils";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";


/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
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
 *     SignupResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message when user is created.
 *           example: User created successfully
 *         error:
 *           type: string
 *           description: Error message if user creation fails.
 *           example: User already exists
 * 
 * /api/signup:
 *   post:
 *     summary: User signup
 *     description: Creates a new user and returns a success message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       200:
 *         description: Successful signup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupResponse'
 *       400:
 *         description: Invalid email or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupResponse'
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

  // Hash the password
  const hash = bcrypt.hashSync(password);

  // Check if a user already exists
  const existingUser = await prisma.administrator.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return Response.json(
      {
        error: "User already exists",
      },
      { status: 400 }
    );
  }

  // Create a user in db
  await prisma.administrator.create({
    data: {
      email,
      password: hash,
    },
  });

  // Return success response
  return Response.json({ message: "User created successfully" });
}