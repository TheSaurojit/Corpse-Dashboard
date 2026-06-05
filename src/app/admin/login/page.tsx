"use client";

import { useState } from "react";
import Image from "next/image";
import { API_BASE } from "@/lib/authutils";

type PageState = "idle" | "sent" | "error";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [pageState, setPageState] = useState<PageState>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestLink = async () => {
        const trimmed = email.trim();
        if (!trimmed) return;

        setLoading(true);
        setErrorMsg("");

        try {
            const res = await fetch(`${API_BASE}/auth/request-link`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmed }),
            });

            const json = await res.json();

            if (res.ok && json.success) {
                sessionStorage.setItem("admin_pending_email", trimmed);
                localStorage.setItem("admin_pending_email", trimmed);
                setPageState("sent");
            } else if (res.status === 401) {
                setErrorMsg("This email is not authorised to access the admin portal.");
                setPageState("error");
            } else if (res.status === 400) {
                setErrorMsg("Please enter a valid email address.");
                setPageState("error");
            } else if (res.status === 502) {
                setErrorMsg("Could not send the magic link. Please try again.");
                setPageState("error");
            } else {
                setErrorMsg(json?.message ?? "Something went wrong. Please try again.");
                setPageState("error");
            }
        } catch {
            setErrorMsg("Network error. Could not reach the server.");
            setPageState("error");
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setPageState("idle");
        setErrorMsg("");
    };

    return (
        <div className="root">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="grid-overlay" />

            <div className="card">
                {/* Logo */}
                <div className="logo-wrap">
                    <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                    <span className="logo-text">Corpse</span>
                </div>

                <div className="divider-line" />

                {/* ── IDLE / ERROR: enter email ── */}
                {(pageState === "idle" || pageState === "error") && (
                    <>
                        <div className="heading-block">
                            <h1 className="heading">Admin Portal</h1>
                            <p className="subheading">
                                Enter your email and we'll send you a sign-in link.
                            </p>
                        </div>

                        <div className="fields">
                            <div className="field-group">
                                <label className="field-label">Email address</label>
                                <input
                                    type="email"
                                    placeholder="admin@corpsearena.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (pageState === "error") setPageState("idle");
                                        setErrorMsg("");
                                    }}
                                    className={`field-input${pageState === "error" ? " field-input--error" : ""}`}
                                    onKeyDown={(e) => e.key === "Enter" && handleRequestLink()}
                                    autoFocus
                                />
                            </div>

                            {pageState === "error" && errorMsg && (
                                <div className="error-box">
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <circle cx="8" cy="8" r="7" stroke="#fc8181" strokeWidth="1.5" />
                                        <path d="M8 5v3.5" stroke="#fc8181" strokeWidth="1.5" strokeLinecap="round" />
                                        <circle cx="8" cy="11" r="0.75" fill="#fc8181" />
                                    </svg>
                                    {errorMsg}
                                </div>
                            )}
                        </div>

                        <button
                            className={`login-btn${loading ? " login-btn--loading" : ""}${!email.trim() ? " login-btn--disabled" : ""}`}
                            onClick={handleRequestLink}
                            disabled={loading || !email.trim()}
                        >
                            {loading ? <span className="spinner" /> : "Send Sign-in Link"}
                        </button>
                    </>
                )}

                {/* ── SENT: check inbox ── */}
                {pageState === "sent" && (
                    <>
                        <div className="heading-block">
                            <div className="check-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="11" stroke="#68d391" strokeWidth="1.5" />
                                    <path d="M7.5 12l3 3 6-6" stroke="#68d391" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h1 className="heading">Check your inbox</h1>
                            <p className="subheading">
                                We sent a sign-in link to{" "}
                                <span className="email-highlight">{email}</span>.
                                Click the link in your email to continue.
                            </p>
                        </div>

                        <div className="inbox-note">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
                                <path d="M8 5v3.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round" />
                                <circle cx="8" cy="11" r="0.75" fill="rgba(255,255,255,0.25)" />
                            </svg>
                            The link expires after a short time. Check your spam folder if you don't see it.
                        </div>

                        <button className="retry-btn" onClick={handleRetry}>
                            ← Use a different email
                        </button>
                    </>
                )}

                <p className="footer-note">
                    Access restricted to authorized administrators only.
                </p>
            </div>

            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .root {
                    min-height: 100vh;
                    background: #0a0a0a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Geist', 'Inter', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                .blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(90px);
                    pointer-events: none;
                    opacity: 0.18;
                }
                .blob-1 {
                    width: 420px; height: 420px;
                    background: radial-gradient(circle, #e53e3e 0%, transparent 70%);
                    top: -100px; left: -80px;
                    animation: drift1 12s ease-in-out infinite alternate;
                }
                .blob-2 {
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, #c53030 0%, transparent 70%);
                    bottom: -80px; right: -60px;
                    animation: drift2 14s ease-in-out infinite alternate;
                }
                @keyframes drift1 { to { transform: translate(30px, 40px); } }
                @keyframes drift2 { to { transform: translate(-25px, -30px); } }

                .grid-overlay {
                    position: absolute; inset: 0;
                    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 28px 28px;
                    pointer-events: none;
                }

                .card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 400px;
                    background: rgba(18, 18, 18, 0.92);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 14px;
                    padding: 40px 36px 32px;
                    backdrop-filter: blur(24px);
                    box-shadow: 0 0 0 1px rgba(229,62,62,0.08), 0 32px 64px rgba(0,0,0,0.6);
                    animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both;
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .logo-wrap {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .logo-text {
                    font-size: 18px;
                    font-weight: 700;
                    color: #fff;
                    letter-spacing: -0.3px;
                }

                .divider-line {
                    height: 1px;
                    background: rgba(255,255,255,0.06);
                    margin-bottom: 28px;
                }

                .heading-block { margin-bottom: 24px; }

                .check-icon {
                    margin-bottom: 14px;
                    display: flex;
                }

                .heading {
                    font-size: 22px;
                    font-weight: 700;
                    color: #f0f0f0;
                    letter-spacing: -0.4px;
                    margin-bottom: 6px;
                }
                .subheading {
                    font-size: 13.5px;
                    color: rgba(255,255,255,0.4);
                    line-height: 1.6;
                }
                .email-highlight {
                    color: rgba(255,255,255,0.7);
                    font-weight: 500;
                }

                .fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
                .field-group { display: flex; flex-direction: column; gap: 6px; }
                .field-label {
                    font-size: 12px;
                    font-weight: 500;
                    color: rgba(255,255,255,0.4);
                    letter-spacing: 0.2px;
                }
                .field-input {
                    width: 100%;
                    padding: 10px 14px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 8px;
                    color: #f0f0f0;
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.18s, background 0.18s;
                }
                .field-input::placeholder { color: rgba(255,255,255,0.2); }
                .field-input:focus {
                    border-color: rgba(229,62,62,0.5);
                    background: rgba(255,255,255,0.06);
                }
                .field-input--error {
                    border-color: rgba(252,129,129,0.4) !important;
                }

                .error-box {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    background: rgba(252,129,129,0.06);
                    border: 1px solid rgba(252,129,129,0.15);
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 12.5px;
                    color: #fc8181;
                    line-height: 1.5;
                    animation: fadeUp 0.2s ease both;
                }
                .error-box svg { flex-shrink: 0; margin-top: 1px; }

                .inbox-note {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 12px;
                    color: rgba(255,255,255,0.3);
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                .inbox-note svg { flex-shrink: 0; margin-top: 1px; }

                .login-btn {
                    width: 100%;
                    padding: 11px 16px;
                    background: #e53e3e;
                    border: none;
                    border-radius: 9px;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    font-family: inherit;
                    cursor: pointer;
                    transition: background 0.18s, transform 0.15s, opacity 0.18s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 42px;
                }
                .login-btn:hover:not(.login-btn--disabled):not(.login-btn--loading) {
                    background: #c53030;
                    transform: translateY(-1px);
                }
                .login-btn:active { transform: translateY(0); }
                .login-btn--disabled { opacity: 0.35; cursor: not-allowed; }
                .login-btn--loading { opacity: 0.7; cursor: not-allowed; }

                .retry-btn {
                    width: 100%;
                    padding: 10px 16px;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 9px;
                    color: rgba(255,255,255,0.4);
                    font-size: 13px;
                    font-family: inherit;
                    cursor: pointer;
                    transition: border-color 0.18s, color 0.18s, background 0.18s;
                    min-height: 40px;
                }
                .retry-btn:hover {
                    border-color: rgba(255,255,255,0.15);
                    color: rgba(255,255,255,0.7);
                    background: rgba(255,255,255,0.03);
                }

                .spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .footer-note {
                    margin-top: 20px;
                    font-size: 11.5px;
                    color: rgba(255,255,255,0.2);
                    text-align: center;
                    line-height: 1.5;
                }

                @media (max-width: 440px) {
                    .card { margin: 16px; padding: 32px 24px 28px; }
                }
            `}</style>
        </div>
    );
}