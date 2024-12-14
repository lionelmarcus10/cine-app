import { createJWT } from "@/lib/jwt-actions";
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