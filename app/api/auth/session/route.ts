import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await getIronSession<SessionData>(
    req,
    NextResponse.next(),
    sessionOptions
  );

  if (!session.isLoggedIn) {
    console.log("Session:", session);
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json(session);
}
