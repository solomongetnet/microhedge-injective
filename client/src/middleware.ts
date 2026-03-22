import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "CrediX_wallet_session";

export async function middleware(request: NextRequest) {
  // const sessionTokenCookie = request.cookies.get(SESSION_COOKIE);
  // const url = request.nextUrl.clone();
  
  // const isAuthenticated = !!sessionTokenCookie?.value;
  // const isDashboardRoute = url.pathname.startsWith("/dashboard");
  // const isOnboardingRoute = url.pathname.startsWith("/onboarding");

  // // If not authenticated and trying to access dashboard or onboarding, redirect to home
  // if (!isAuthenticated && (isDashboardRoute || isOnboardingRoute)) {
  //   url.pathname = "/";
  //   return NextResponse.redirect(url);
  // }

  // If authenticated and trying to access home or landing page, maybe redirect to dashboard
  // But usually we allow visiting the home page.
  // Let's keep it simple for now and only protect dashboard.

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
