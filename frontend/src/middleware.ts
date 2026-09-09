import { NextResponse } from "next/server";

// Auth Central tokens deliberately remain in browser memory. Because Edge
// middleware cannot read them, it must not make an authentication decision
// from an absent cookie. The client shell checks the session, while every API
// route still validates the Bearer JWT on the server.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
