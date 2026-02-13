import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
console.log(request.cookies);

  // Route Types
  const isProtectedRoute =
    path.startsWith("/dashboard") 
  const isAuthRoute =
    path.startsWith("/sign-in") ||   path.startsWith("/sign-up") 

  // Check for Session Cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("accessToken")?.value;
  // Protect Private Routes
  if (isProtectedRoute && !sessionToken) {
    // redirect URL
    const response = new URL("/sign-in", request.url);
    return NextResponse.redirect(response);
  }else if(isAuthRoute && sessionToken){
    const response = new URL("/dashboard", request.url);
    return NextResponse.redirect(response);
  }

  // proceed to next
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
  ],
};