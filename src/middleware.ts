import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/register", "/api"];

const getSecretKey = () => {
  return new TextEncoder().encode(process.env.JWT_SECRET || "default-secret");
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware processing:", pathname);

  // Skip static files and Next.js internal routes
  if (
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // Allow access to public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    console.log("Public path accessed:", pathname);
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    console.log("No token found, redirecting to login from:", pathname);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    console.log("Valid JWT:", payload);
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid JWT:", error);
    // Clear invalid token
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: [
    "/",
    "/notes/:path*", 
    "/timeline/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
