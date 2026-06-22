// middleware.ts
// Place this at the ROOT of your project (same level as app/, not inside it)
//
// Protects all routes except /admin/login and /admin/auth/* and /admin/invite/*
// Anyone without a session token gets redirected to /admin/login

import { NextRequest, NextResponse } from "next/server";

const SESSION_TOKEN_KEY = "admin_session_token";

// Routes that don't require auth
const PUBLIC_PATHS = [
    "/admin/login",
    "/admin/auth/callback",
    "/admin/invite/callback",
];

export function middleware(req: NextRequest) {

    
    const { pathname } = req.nextUrl;

    // Allow public paths through
    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    if (isPublic) return NextResponse.next();

    // Allow Next.js internals and static files through
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Check for session token in cookies (middleware can't read localStorage)
    // So we store a copy in a cookie on login
    const token = req.cookies.get(SESSION_TOKEN_KEY)?.value ?? "";

    if (!token) {
        const loginUrl = new URL("/admin/login", req.url);
        // Preserve the intended destination so we can redirect back after login
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - _next/static
         * - _next/image
         * - favicon.ico
         * - public files with extensions
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};