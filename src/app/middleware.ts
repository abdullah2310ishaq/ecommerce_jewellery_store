import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Protected admin routes
  const protectedPaths = ["/admin", "/admin/orders"];
  const url = req.nextUrl.pathname;

  // Get the cookie to check if the user is authenticated
  const hasAccess = req.cookies.get("admin-auth")?.value === process.env.ADMIN_PASSWORD;

  // If the user tries to access a protected path without access, redirect to login
  if (protectedPaths.includes(url) && !hasAccess) {
    return NextResponse.redirect(new URL("/admin/loggin", req.url));
  }

  return NextResponse.next();
}

// Apply the middleware only to /admin and /admin/orders
export const config = {
  matcher: ["/admin", "/admin/orders"],
};