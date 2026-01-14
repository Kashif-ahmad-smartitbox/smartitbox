import { NextResponse } from "next/server"; 
import type { NextRequest } from "next/server"; 

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminRoot = pathname === "/admin";
  const isAdminProtected = pathname.startsWith("/admin") && !isLoginPage;

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  if ((isAdminProtected || isAdminRoot) && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isAdminRoot && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
