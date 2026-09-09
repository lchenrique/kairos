import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  canAccessPath,
  defaultPathForRole,
  isAppRole,
} from "@/lib/permissions";

const publicPaths = [
  "/",
  "/login",
  "/setup",
  "/cadastro",
  "/forgot-password",
  "/reset-password",
  "/accept-invite",
];

function isPublicPath(pathname: string) {
  return publicPaths.some(
    (path) =>
      pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
  );
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("token", "", { path: "/", maxAge: 0 });
  return response;
}

async function getSessionStatus(request: NextRequest) {
  const internalApiUrl =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3333";
  try {
    const response = await fetch(`${internalApiUrl}/auth/profile`, {
      headers: { cookie: request.headers.get("cookie") || "" },
      cache: "no-store",
    });
    if (response.ok) {
      const profile = (await response.json()) as { role?: unknown };
      if (!isAppRole(profile.role)) return { status: "invalid" as const };
      return { status: "valid" as const, role: profile.role };
    }
    if (response.status === 401 || response.status === 403)
      return { status: "invalid" as const };
    return { status: "unavailable" as const };
  } catch {
    return { status: "unavailable" as const };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Tokens intentionally live only in browser memory. Edge middleware cannot
  // inspect them; API calls enforce the Bearer JWT at the Fastify boundary.
  const token = undefined;
  const isLoginPage = pathname === "/login" || pathname.startsWith("/login/");

  if (!token) {
    return isPublicPath(pathname)
      ? NextResponse.next()
      : redirectToLogin(request);
  }

  if (!isPublicPath(pathname) || isLoginPage) {
    const session = await getSessionStatus(request);
    if (session.status === "invalid") return redirectToLogin(request);
    if (session.status === "valid") {
      const defaultPath = defaultPathForRole(session.role);
      if (isLoginPage)
        return NextResponse.redirect(new URL(defaultPath, request.url));
      if (!isPublicPath(pathname) && !canAccessPath(session.role, pathname))
        return NextResponse.redirect(new URL(defaultPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
