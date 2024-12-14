import { isValidEmail, isValidPassword } from "@/lib/utils";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";

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