// import { NextRequest, NextResponse } from "next/server";
// import { getIronSession } from "iron-session";
// import { SessionData, sessionOptions } from "@/lib/session";

// export async function GET(req: NextRequest) {
//   const session = await getIronSession<SessionData>(
//     req,
//     NextResponse.next(),
//     sessionOptions
//   );

//   console.log("Session data in API:", session);

//   if (!session.isLoggedIn) {
//     console.log("Session:", session);
//     return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
//   }
//   return NextResponse.json(session);
// }

import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

export async function GET(req: NextRequest) {
  // Create a response object to modify
  const res = NextResponse.json({});
  
  // Get the session using both request and response
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  // console.log("Session data in API:", session);

  if (!session.isLoggedIn) {
    console.log("Not authenticated:", session);
    return NextResponse.json({ isLoggedIn: false }, { status: 200 }); // Return 200 with isLoggedIn: false
  }
  
  return NextResponse.json({
    userid: session.userid,
    firstname: session.firstname,
    middlename: session.middlename,
    lastname: session.lastname,
    email: session.email,
    isAdmin: session.isAdmin,
    isLoggedIn: session.isLoggedIn
  });
}