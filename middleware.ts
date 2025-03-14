// This middleware protects routes that require authentication

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { type SessionData, sessionOptions } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  const session = await getIronSession<SessionData>(
    request,
    res,
    sessionOptions
  );

  // If the user is not logged in and trying to access a protected route
  if (!session.isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Check if the request URL matches any of the protected paths
  if (
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    // If user is not defined or does not have access, redirect to access denied page
    if (!session.isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/"; // Redirect to an unauthorized page
      return NextResponse.redirect(url);
    }
  }

  return res;
}

const protectedPaths = [
  "/faculty/:path*",
  "/room/:path*",
  "/section/:path*",
  "/subject/:path*",
  "/course/:path*",
  "/faculty-sched/:path*",
  "/room-sched/:path*",
  "/section-sched/:path*",
  "/subject-sched/:path*",
  "/course-sched/:path*",
];

// Add all protected routes here
export const config = {
  matcher: [
    "/faculty/:path*",
    "/room/:path*",
    "/section/:path*",
    "/subject/:path*",
    "/course/:path*",
    "/faculty-sched/:path*",
    "/room-sched/:path*",
    "/section-sched/:path*",
    "/subject-sched/:path*",
    "/course-sched/:path*",
  ],
};
