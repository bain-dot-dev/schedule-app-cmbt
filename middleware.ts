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

  // console.log("Session data:", session);

  const pathname = request.nextUrl.pathname;

  // Redirect if not logged in
  if (!session.isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If the route is /users (admin-only) and the user is not an admin
  if (pathname.startsWith("/users") && !session.isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return res;
}

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
    "/users/:path*", // admin-only path
  ],
};
