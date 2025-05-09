import { SessionOptions } from "iron-session";

export interface SessionData {
  userid?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  email?: string;
  isLoggedIn?: boolean;
  role?: string;
  courseProgramID?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "cmbt-scheduling-session",
  ttl: 12 * 60 * 60, // 24 hours
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};

export const defaultSession: SessionData = {
  isLoggedIn: false,
};
