
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
    process.env.ADMIN_API_URL ??
    "https://corpse-backend-dev.up.railway.app/api/admin";

async function handler(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    // In Next.js 15+, params is a Promise — must be awaited
    const { path } = await params;

    const targetPath = path.join("/");
    const search = req.nextUrl.search ?? "";
    const targetUrl = `${BACKEND_BASE}/${targetPath}${search}`;

    console.log(`[PROXY] ${req.method} ${targetUrl}`);

    const forwardHeaders: Record<string, string> = {
        "Content-Type": req.headers.get("Content-Type") ?? "application/json",
    };

    const auth = req.headers.get("Authorization");
    if (auth) forwardHeaders["Authorization"] = auth;

    let body: string | undefined;
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
        body = await req.text();
    }

    try {
        const backendRes = await fetch(targetUrl, {
            method: req.method,
            headers: forwardHeaders,
            body,
        });

        const data = await backendRes.text();
        console.log(`[PROXY] Response: ${backendRes.status}`);

        return new NextResponse(data, {
            status: backendRes.status,
            headers: {
                "Content-Type": backendRes.headers.get("Content-Type") ?? "application/json",
            },
        });
    } catch (err) {
        console.error("[PROXY] Fetch failed:", err);
        return NextResponse.json(
            { success: false, message: "Proxy fetch failed" },
            { status: 502 }
        );
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;