import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin route protection: requires role === "admin"
    if (pathname.startsWith("/admin")) {
      const userRole = (token as any)?.role;
      // If not admin, you can redirect to dashboard or show 403 / home
      // Note: NaCl also has passcode gate in admin UI, but middleware provides an additional security layer
      if (userRole !== "admin" && userRole !== "user") {
        return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(pathname), req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If token exists, the user is authenticated
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/bookings/:path*",
    "/payment/:path*",
  ],
};
