"use server";

import { NextRequest, NextResponse } from "next/server";
// import { serverSession } from "./lib/auth-server";

export async function middleware(request: NextRequest) {
  const sessionTokenCookie = request.cookies.get("better-auth.session_token");
  // const session = await serverSession();

  // console.log({ cookies: sessionTokenCookie?.value });

  // const url = request.nextUrl.clone();
  // const isAuthenticated = !!sessionTokenCookie

  // if (!isAuthenticated && !url.pathname.includes("auth")) {
  //   url.pathname = "/auth";
  //   return NextResponse.redirect(url);
  // }

  // if (isAuthenticated && url.pathname.includes("auth")) {
  //   url.pathname = "/";
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Apply middleware to all routes except API and static files
  // runtime: "nodejs",
};
