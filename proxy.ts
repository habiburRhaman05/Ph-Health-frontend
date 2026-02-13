import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. Identify routes
  const isProtectedRoute = path.startsWith("/dashboard");
  const isAuthRoute = path.startsWith("/sign-in") || path.startsWith("/sign-up");

  // 2. Get the token
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("accessToken")?.value;
    request.cookies.get("refreshToken")?.value;

  // 3. Handle Protected Routes
  if (isProtectedRoute && !sessionToken) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    // FIX: Disable middleware caching so it re-checks cookies on every reload
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  // 4. Handle Auth Routes (e.g., don't show login if already logged in)
  if (isAuthRoute && sessionToken) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
