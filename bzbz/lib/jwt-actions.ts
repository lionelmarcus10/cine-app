import 'server-only'
import * as jose from "jose";
import { Administrator } from '@prisma/client';
import { cookies } from 'next/headers';


export async function createJWT(user: Administrator){ 
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const alg = "HS256";

const jwt = await new jose.SignJWT({
  "id": user.id
})
    .setProtectedHeader({ alg })
    .setExpirationTime("72h")
    .sign(secret);
return jwt
}

export async function verifyJWT(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (payload.exp && payload.exp < currentTime) {
        return null; // Token has expired
    }
    return payload;
  } catch (error) {
    return null;
  }
}


export async function verifySession() {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyJWT(token);
  return payload ? payload : null;
}
