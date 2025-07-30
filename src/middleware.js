import { NextResponse } from "next/server";
import authConfig from "./lib/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request) {
  const session = !!request.auth;
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // it looks like, we are using these in places. do not remove!
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(.*)$/) // static files like .png, .css, .js
  ) {
    return response;
  }

  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (pathname === "/") {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!session && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: ["/", "/home", "/auth/:path*", "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
