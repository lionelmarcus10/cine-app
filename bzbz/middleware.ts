import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
// import { unauthorized } from "next/navigation";
import { verifySession } from "./lib/jwt-actions";
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  
  
  // Check session
  const session = await verifySession()
  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/admin-dashboard/:path*",
};