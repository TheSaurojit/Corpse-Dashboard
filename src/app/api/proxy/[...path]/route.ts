import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = process.env.ADMIN_API_URL;


async function handler(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;

    const targetPath = path.join("/");
    const search = req.nextUrl.search ?? "";
    const targetUrl = `${BACKEND_BASE}/${targetPath}${search}`;

    console.log(`[PROXY] ${req.method} ${targetUrl}`);

    const contentType = req.headers.get("Content-Type") ?? "";
    const isMultipart = contentType.startsWith("multipart/form-data");

    const forwardHeaders: Record<string, string> = {};

    // Always forward the exact Content-Type from the client.
    // For multipart this includes the boundary string — never override it.
    if (contentType) {
        forwardHeaders["Content-Type"] = contentType;
    } else {
        forwardHeaders["Content-Type"] = "application/json";
    }

    const auth = req.headers.get("Authorization");
    if (auth) forwardHeaders["Authorization"] = auth;

    // For multipart: stream the raw body directly — buffering it breaks the boundary.
    // For JSON/text: read as text, same as before.
    let body: ReadableStream | string | undefined;
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
        if (isMultipart) {
            // Pipe the raw stream straight to the backend without buffering
            body = req.body ?? undefined;
        } else {
            body = await req.text();
        }
    }

    try {
        const controller = new AbortController();

        const backendRes = await fetch(targetUrl, {
            method: req.method,
            headers: forwardHeaders,
            body,
            // Required for streaming body in Node.js fetch
            // @ts-expect-error – duplex is needed when body is a ReadableStream
            duplex: isMultipart ? "half" : undefined,
            signal: controller.signal,
        });

        const data = await backendRes.text();
        console.log(`[PROXY] Response: ${backendRes.status}`);

        return new NextResponse(data, {
            status: backendRes.status,
            headers: {
                "Content-Type": backendRes.headers.get("Content-Type") ?? "application/json",
            },
        });
    } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
            console.error("[PROXY] Request timed out:", targetUrl);
            return NextResponse.json(
                { success: false, message: "Request timed out. The server took too long to respond." },
                { status: 504 }
            );
        }
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