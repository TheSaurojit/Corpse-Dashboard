

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { API_BASE, SESSION_TOKEN_KEY } from "@/lib/authutils";

const LOGIN_ROUTE = "/admin/login";
const HOME_ROUTE = "/";

type PageState =
    | "loading"
    | "check_inbox"
    | "verifying"
    | "success"
    | "error"
    | "missing_email"
    | "invalid_token"
    | "token_used"
    | "token_expired";

export default function InviteCallbackPage() {
    const router = useRouter();
    const hasRun = useRef(false);

    const [pageState, setPageState] = useState<PageState>("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const [manualEmail, setManualEmail] = useState("");
    const storedOobCode = useRef<string | null>(null);
    const storedInviteToken = useRef<string | null>(null);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.search);
        const oobCode = params.get("oobCode") ?? null;
        const inviteToken = params.get("token") ?? null;
        const mode = params.get("mode") ?? null;

        // ── No invite token at all — broken link ──────────────────
        if (!inviteToken) {
            setPageState("invalid_token");
            return;
        }

        storedInviteToken.current = inviteToken;

        // ── SECOND VISIT: Firebase redirected back with oobCode ───
        if (mode === "signIn" && oobCode) {
            storedOobCode.current = oobCode;
            sessionStorage.setItem("pending_oob_code", oobCode);
            sessionStorage.setItem("pending_invite_token", inviteToken);

            // Try to resolve email
            const email =
                sessionStorage.getItem("admin_pending_email") ??
                localStorage.getItem("admin_pending_email") ??
                params.get("email") ??
                "";

            if (!email) {
                setPageState("missing_email");
                return;
            }

            doVerify(oobCode, email, inviteToken);
            return;
        }

        // ── FIRST VISIT: just the invite token, accept it ─────────
        doAccept(inviteToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Step 4: POST /invite/accept { token } ────────────────────────────────
    async function doAccept(token: string) {
        setPageState("loading");
        try {
            const res = await fetch(`${API_BASE}/invite/accept`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            let json: { success?: boolean; message?: string } = {};
            try { json = await res.json(); } catch { /* empty */ }

            if (res.ok && json.success) {
                // Magic link sent — show "check inbox"
                setPageState("check_inbox");
                return;
            }

            if (res.status === 404) { setPageState("invalid_token"); return; }
            if (res.status === 409) { setPageState("token_used");    return; }
            if (res.status === 410) { setPageState("token_expired"); return; }

            setErrorMsg(json?.message ?? "Something went wrong. Please try again.");
            setPageState("error");

        } catch {
            setErrorMsg("Network error — could not reach the server.");
            setPageState("error");
        }
    }

    // ── Step 8: POST /auth/verify { email, oobCode, inviteToken } ────────────
    async function doVerify(oobCode: string, email: string, inviteToken: string) {
        setPageState("verifying");
        try {
            const res = await fetch(`${API_BASE}/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, oobCode, inviteToken }),
            });

            let json: { success?: boolean; message?: string; data?: { token: string } } = {};
            try { json = await res.json(); } catch { /* empty */ }

            if (res.ok && json.success && json.data?.token) {
                localStorage.setItem(SESSION_TOKEN_KEY, json.data.token);
                sessionStorage.removeItem("admin_pending_email");
                sessionStorage.removeItem("pending_oob_code");
                sessionStorage.removeItem("pending_invite_token");
                localStorage.removeItem("admin_pending_email");

                setPageState("success");
                setTimeout(() => router.replace(HOME_ROUTE), 1200);
                return;
            }

            if (res.status === 401)  setErrorMsg("This sign-in link is invalid or has expired.");
            else if (res.status === 400)  setErrorMsg("Verification failed — email or code is incorrect.");
            else if (res.status === 404)  setErrorMsg("Invite token not found.");
            else if (res.status === 409)  setErrorMsg("This invite has already been used.");
            else if (res.status === 410)  setErrorMsg("This invite has expired.");
            else setErrorMsg(json?.message ?? "Verification failed. Please try again.");

            setPageState("error");

        } catch {
            setErrorMsg("Network error — could not reach the server.");
            setPageState("error");
        }
    }

    // Called when user manually types email after cross-tab/device loss
    function handleManualVerify() {
        const email = manualEmail.trim();
        if (!email) return;

        const oobCode =
            storedOobCode.current ??
            sessionStorage.getItem("pending_oob_code") ??
            new URLSearchParams(window.location.search).get("oobCode") ??
            null;

        const inviteToken =
            storedInviteToken.current ??
            sessionStorage.getItem("pending_invite_token") ??
            new URLSearchParams(window.location.search).get("token") ??
            null;

        if (!oobCode || !inviteToken) {
            setErrorMsg("Sign-in code is no longer available. Please request a new invite.");
            setPageState("error");
            return;
        }

        localStorage.setItem("admin_pending_email", email);
        doVerify(oobCode, email, inviteToken);
    }

    // ── Render ────────────────────────────────────────────────────────────────
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

                {/* LOADING */}
                {(pageState === "loading" || pageState === "verifying") && (
                    <div className="state-block">
                        <div className="spinner-lg" />
                        <h1 className="heading">
                            {pageState === "verifying" ? "Verifying your link…" : "Validating invite…"}
                        </h1>
                        <p className="subheading">Please wait a moment.</p>
                    </div>
                )}

                {/* CHECK INBOX — magic link sent */}
                {pageState === "check_inbox" && (
                    <div className="state-block">
                        <MailIcon />
                        <h1 className="heading" style={{ marginTop: 14 }}>Check your inbox</h1>
                        <p className="subheading">
                            We've sent a sign-in link to your email address.
                            Click it to complete your account setup.
                        </p>
                        <div className="info-box">
                            The link expires after a short time. Check your spam folder if you don't see it.
                        </div>
                    </div>
                )}

                {/* SUCCESS */}
                {pageState === "success" && (
                    <div className="state-block">
                        <CheckCircleIcon color="#68d391" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Welcome aboard!</h1>
                        <p className="subheading">Your account is set up. Redirecting to the dashboard…</p>
                    </div>
                )}

                {/* MISSING EMAIL — opened in different browser */}
                {pageState === "missing_email" && (
                    <div className="state-block" style={{ width: "100%" }}>
                        <AlertCircleIcon color="#f6ad55" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Confirm your email</h1>
                        <p className="subheading">
                            It looks like you opened this link in a different browser.
                            Enter the email address the invite was sent to.
                        </p>
                        <div className="email-reentry">
                            <input
                                type="email"
                                placeholder="your@email.com"
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
                    </div>
                )}

                {/* ERROR */}
                {pageState === "error" && (
                    <div className="state-block">
                        <AlertCircleIcon color="#fc8181" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Something went wrong</h1>
                        <p className="subheading">{errorMsg}</p>
                        <button className="action-btn" onClick={() => router.replace(LOGIN_ROUTE)}>
                            ← Back to login
                        </button>
                    </div>
                )}

                {/* INVALID TOKEN */}
                {pageState === "invalid_token" && (
                    <div className="state-block">
                        <AlertCircleIcon color="#fc8181" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Invalid invite link</h1>
                        <p className="subheading">
                            This invite link is invalid or missing required parameters.
                            Please ask the admin to send you a new invite.
                        </p>
                        <button className="action-btn" onClick={() => router.replace(LOGIN_ROUTE)}>
                            ← Back to login
                        </button>
                    </div>
                )}

                {/* TOKEN USED */}
                {pageState === "token_used" && (
                    <div className="state-block">
                        <AlertCircleIcon color="#f6ad55" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Invite already used</h1>
                        <p className="subheading">
                            This invite link has already been accepted. If you already have an account,
                            you can sign in directly.
                        </p>
                        <button className="action-btn" onClick={() => router.replace(LOGIN_ROUTE)}>
                            Go to login
                        </button>
                    </div>
                )}

                {/* TOKEN EXPIRED */}
                {pageState === "token_expired" && (
                    <div className="state-block">
                        <AlertCircleIcon color="#f6ad55" />
                        <h1 className="heading" style={{ marginTop: 14 }}>Invite expired</h1>
                        <p className="subheading">
                            This invite link expired after 48 hours. Please ask the admin to send you a new one.
                        </p>
                        <button className="action-btn" onClick={() => router.replace(LOGIN_ROUTE)}>
                            ← Back to login
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
                .info-box { display: flex; align-items: flex-start; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px 12px; font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.5; }
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

function MailIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="#68d391" strokeWidth="1.5" />
            <path d="M2 8l10 6 10-6" stroke="#68d391" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}