import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token && request.nextUrl.pathname.startsWith("/client")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
