"use client";

import { useState } from "react";

export default function LoginPage() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="root">
      {/* Ambient background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="grid-overlay" />

      <div className="card">
        {/* Logo */}
        <div className="logo-wrap">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2L4 8v12l10 6 10-6V8L14 2z"
                fill="#e53e3e"
                opacity="0.15"
                stroke="#e53e3e"
                strokeWidth="1.5"
              />
              <path
                d="M14 7l-6 3.5v7L14 21l6-3.5v-7L14 7z"
                fill="#e53e3e"
                opacity="0.3"
              />
              <circle cx="14" cy="14" r="3" fill="#e53e3e" />
            </svg>
          </div>
          <span className="logo-text">Corpse</span>
        </div>

        <div className="divider-line" />

        {/* Heading */}
        <div className="heading-block">
          <h1 className="heading">Admin Portal</h1>
          <p className="subheading">Sign in to access the dashboard</p>
        </div>

        {/* Google button */}
        <button
          className={`google-btn${hovered ? " google-btn--hovered" : ""}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className="google-icon">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
          </span>
          <span className="google-label">Continue with Google</span>
          <span className="google-arrow">→</span>
        </button>

        {/* Footer note */}
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

        /* Subtle red ambient blobs */
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

        /* Dot-grid overlay */
        .grid-overlay {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        /* Card */
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

        /* Logo */
        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .logo-icon {
          width: 36px; height: 36px;
          background: rgba(229,62,62,0.1);
          border: 1px solid rgba(229,62,62,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
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

        /* Heading */
        .heading-block { margin-bottom: 28px; }
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
          line-height: 1.5;
        }

        /* Google button */
        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
          color: #e0e0e0;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.1px;
          position: relative;
        }
        .google-btn:hover, .google-btn--hovered {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }
        .google-btn:active { transform: translateY(0); }

        .google-icon {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px;
          background: #fff;
          border-radius: 5px;
          flex-shrink: 0;
        }
        .google-label { flex: 1; text-align: left; }
        .google-arrow {
          font-size: 16px;
          color: rgba(255,255,255,0.25);
          transition: color 0.18s, transform 0.18s;
        }
        .google-btn:hover .google-arrow {
          color: rgba(255,255,255,0.5);
          transform: translateX(2px);
        }

        /* Footer note */
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