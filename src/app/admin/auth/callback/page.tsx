// FILE MUST BE AT: app/admin/auth/callback/page.tsx
//
// Firebase redirects to: /admin/auth/callback?oobCode=xxx&mode=signIn
// This matches that exact path.

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HOME_ROUTE = "/";
const LOGIN_ROUTE = "/admin/login";
const SESSION_TOKEN_KEY = "admin_session_token";

type PageState =
    | "verifying"
    | "success"
    | "error"
    | "missing_token"
    | "missing_email";

export default function AuthCallbackPage() {
    const router = useRouter();
    const hasRun = useRef(false);

    const [pageState, setPageState] = useState<PageState>("verifying");
    const [errorMsg, setErrorMsg] = useState("");
    const [manualEmail, setManualEmail] = useState("");
    const storedOobCode = useRef<string | null>(null);

    useEffect(() => {
        // Strict-mode / HMR guard — only run once
        if (hasRun.current) return;
        hasRun.current = true;

        // ── Read params directly from window.location so we never
        //    race against Next.js's searchParams hydration ──────────
        const params = new URLSearchParams(window.location.search);

        const oobCode = params.get("oobCode") ?? params.get("token") ?? null;
        const mode    = params.get("mode");   // Firebase sends mode=signIn

        // If Firebase sent a different mode (e.g. resetPassword) bail early
        if (mode && mode !== "signIn") {
            setErrorMsg(`Unexpected mode "${mode}" — this link is not a sign-in link.`);
            setPageState("error");
            return;
        }

        if (!oobCode) {
            setPageState("missing_token");
            return;
        }

        // Stash oobCode so the manual-email form can use it
        storedOobCode.current = oobCode;
        sessionStorage.setItem("pending_oob_code", oobCode);

        // ── Resolve email ──────────────────────────────────────────
        // sessionStorage: set on same tab before requesting link
        // localStorage:   cross-tab / page-reload fallback
        // URL param:      only present on invite flow, not regular sign-in
        const email =
            sessionStorage.getItem("admin_pending_email") ??
            localStorage.getItem("admin_pending_email") ??
            params.get("email") ??
            "";

        if (!email) {
            // Can't auto-verify — ask user to re-enter their email
            setPageState("missing_email");
            return;
        }

        doVerify(oobCode, email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    async function doVerify(oobCode: string, email: string) {
        setPageState("verifying");

        try {
            const res = await fetch("/api/proxy/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, oobCode }),
            });

            let json: { success?: boolean; message?: string; data?: { token: string; role: string; email: string } };
            try {
                json = await res.json();
            } catch {
                json = {};
            }

            console.log("[AuthCallback] verify →", res.status, json);

            if (res.ok && json.success && json.data?.token) {
                // ── Success: persist token and clear temp keys ────────
                localStorage.setItem(SESSION_TOKEN_KEY, json.data.token);
                sessionStorage.removeItem("admin_pending_email");
                sessionStorage.removeItem("pending_oob_code");
                localStorage.removeItem("admin_pending_email");

                setPageState("success");
                // Small delay so the user sees the success state
                setTimeout(() => router.replace(HOME_ROUTE), 1200);
                return;
            }

            // ── Error cases from the API spec ─────────────────────────
            if (res.status === 401) {
                setErrorMsg("This sign-in link is invalid or has expired. Please request a new one.");
            } else if (res.status === 400) {
                setErrorMsg("Verification failed — the email or code is incorrect.");
            } else if (res.status === 502) {
                setErrorMsg("Firebase error on the server. Please try again in a moment.");
            } else {
                setErrorMsg(json?.message ?? "Verification failed. Please try again.");
            }

            setPageState("error");

        } catch (err) {
            console.error("[AuthCallback] fetch error:", err);
            setErrorMsg("Network error — could not reach the server.");
            setPageState("error");
        }
    }

    // Called when user manually types their email after cross-tab/device loss
    function handleManualVerify() {
        const email = manualEmail.trim();
        if (!email) return;

        const oobCode =
            storedOobCode.current ??
            sessionStorage.getItem("pending_oob_code") ??
            new URLSearchParams(window.location.search).get("oobCode") ??
            null;

        if (!oobCode) {
            setErrorMsg("The sign-in code is no longer available. Please request a new link.");
            setPageState("error");
            return;
        }

        // Persist so doVerify can clean it up on success
        localStorage.setItem("admin_pending_email", email);
        doVerify(oobCode, email);
    }

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="root">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="grid-overlay" />

            <div className="card">
                <div className="logo-wrap">
                    <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                    <span className="logo-text">Corpse</span>
                </div>
                <div className="divider-line" />

                {pageState === "verifying" && (
                    <div className="state-block">
                        <div className="spinner-lg" />
                        <h1 className="heading">Verifying your link…</h1>
                        <p className="subheading">Please wait while we sign you in.</p>
                    </div>
                )}

                {pageState === "success" && (
                    <div className="state-block">
                        <CheckCircleIcon color="#68d391" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Signed in!</h1>
                        <p className="subheading">Redirecting you to the dashboard…</p>
                    </div>
                )}

                {pageState === "error" && (
                    <div className="state-block">
                        <AlertCircleIcon color="#fc8181" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Verification failed</h1>
                        <p className="subheading">{errorMsg}</p>
                        <button className="action-btn" onClick={() => router.replace(LOGIN_ROUTE)}>
                            ← Back to login
                        </button>
                    </div>
                )}

                {pageState === "missing_token" && (
                    <div className="state-block">
                        <AlertCircleIcon color="#fc8181" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Invalid link</h1>
                        <p className="subheading">
                            This link is missing the sign-in token. Please click the original link
                            directly from your email — don't copy-paste just part of the URL.
                        </p>
                        <button className="action-btn" onClick={() => router.replace(LOGIN_ROUTE)}>
                            ← Request a new link
                        </button>
                    </div>
                )}

                {pageState === "missing_email" && (
                    <div className="state-block" style={{ width: "100%" }}>
                        <AlertCircleIcon color="#f6ad55" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Confirm your email</h1>
                        <p className="subheading">
                            It looks like you opened this link in a different browser or tab.
                            Enter the email address you signed in with to continue.
                        </p>

                        <div className="email-reentry">
                            <input
                                type="email"
                                placeholder="admin@corpsearena.com"
                                value={manualEmail}
                                onChange={(e) => setManualEmail(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
                                className="field-input"
                                autoFocus
                            />
                            <button
                                className={`confirm-btn${!manualEmail.trim() ? " confirm-btn--disabled" : ""}`}
                                onClick={handleManualVerify}
                                disabled={!manualEmail.trim()}
                            >
                                Confirm &amp; Sign In
                            </button>
                        </div>

                        <button
                            className="action-btn"
                            style={{ marginTop: 8 }}
                            onClick={() => router.replace(LOGIN_ROUTE)}
                        >
                            ← Use a different email instead
                        </button>
                    </div>
                )}

                <p className="footer-note">
                    Access restricted to authorized administrators only.
                </p>
            </div>

            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .root {
                    min-height: 100vh; background: #0a0a0a;
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Geist', 'Inter', sans-serif;
                    position: relative; overflow: hidden;
                }
                .blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; opacity: 0.18; }
                .blob-1 { width: 420px; height: 420px; background: radial-gradient(circle, #e53e3e 0%, transparent 70%); top: -100px; left: -80px; animation: drift1 12s ease-in-out infinite alternate; }
                .blob-2 { width: 300px; height: 300px; background: radial-gradient(circle, #c53030 0%, transparent 70%); bottom: -80px; right: -60px; animation: drift2 14s ease-in-out infinite alternate; }
                @keyframes drift1 { to { transform: translate(30px, 40px); } }
                @keyframes drift2 { to { transform: translate(-25px, -30px); } }
                .grid-overlay { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; }
                .card { position: relative; z-index: 10; width: 100%; max-width: 420px; background: rgba(18,18,18,0.92); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 40px 36px 32px; backdrop-filter: blur(24px); box-shadow: 0 0 0 1px rgba(229,62,62,0.08), 0 32px 64px rgba(0,0,0,0.6); animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .logo-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
                .logo-text { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
                .divider-line { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 28px; }
                .state-block { display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 8px; width: 100%; }
                .spinner-lg { width: 28px; height: 28px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #e53e3e; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .heading { font-size: 22px; font-weight: 700; color: #f0f0f0; letter-spacing: -0.4px; margin-bottom: 8px; }
                .subheading { font-size: 13.5px; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 20px; }
                .action-btn { padding: 10px 16px; background: transparent; border: 1px solid rgba(255,255,255,0.08); border-radius: 9px; color: rgba(255,255,255,0.4); font-size: 13px; font-family: inherit; cursor: pointer; transition: border-color 0.18s, color 0.18s, background 0.18s; min-height: 40px; }
                .action-btn:hover { border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03); }
                .email-reentry { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 12px; }
                .field-input { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #f0f0f0; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.18s, background 0.18s; }
                .field-input::placeholder { color: rgba(255,255,255,0.2); }
                .field-input:focus { border-color: rgba(229,62,62,0.5); background: rgba(255,255,255,0.06); }
                .confirm-btn { width: 100%; padding: 11px 16px; background: #e53e3e; border: none; border-radius: 9px; color: #fff; font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer; transition: background 0.18s, transform 0.15s; min-height: 42px; }
                .confirm-btn:hover:not(.confirm-btn--disabled) { background: #c53030; transform: translateY(-1px); }
                .confirm-btn--disabled { opacity: 0.35; cursor: not-allowed; }
                .footer-note { margin-top: 20px; font-size: 11.5px; color: rgba(255,255,255,0.2); text-align: center; line-height: 1.5; }
                @media (max-width: 440px) { .card { margin: 16px; padding: 32px 24px 28px; } }
            `}</style>
        </div>
    );
}

function CheckCircleIcon({ color }: { color: string }) {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="1.5" />
            <path d="M7.5 12l3 3 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AlertCircleIcon({ color }: { color: string }) {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="1.5" />
            <path d="M12 7v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="15.5" r="1" fill={color} />
        </svg>
    );
}