"use client";

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    // wire up your signInWithGoogle() here
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,48,42,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(232,48,42,0.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow orbs */}
      <div className="fixed -top-32 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(232,48,42,0.12), transparent 70%)", filter: "blur(100px)" }} />
      <div className="fixed -bottom-24 -right-24 w-[380px] h-[380px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(232,48,42,0.08), transparent 70%)", filter: "blur(100px)" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-9 h-9 bg-[#e8302a] flex items-center justify-center flex-shrink-0"
            style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7v5c0 5.25 4.25 10.15 10 11.35C17.75 22.15 22 17.25 22 12V7L12 2z" />
            </svg>
          </div>
          <span className="text-[#f0f0f0] text-2xl font-bold tracking-wide">
            Corpse
          </span>
        </div>

        {/* Tagline */}
        <p className="text-[#e8302a] text-[10px] uppercase tracking-[2.5px] font-semibold mb-5">
          Esports Tournament Platform
        </p>

        {/* Card */}
        <div className="w-full bg-[#161616] border border-[#2a2a2a] rounded-2xl px-8 py-9 relative overflow-hidden">

          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #e8302a 50%, transparent)" }}
          />

          {/* Inner top glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(232,48,42,0.07) 0%, transparent 60%)" }}
          />

          {/* Beta badge */}
          <span className="absolute top-0 right-5 bg-[#e8302a] text-white text-[9px] font-bold tracking-[1.5px] uppercase px-2.5 py-0.5 rounded-b-md">
            Beta
          </span>

          {/* Header */}
          <div className="text-center mb-7 relative z-10">
            <h1 className="text-[#f0f0f0] text-3xl font-bold tracking-tight leading-none">
              Welcome Back
            </h1>
            <p className="text-[#555] text-[13px] mt-2.5 leading-relaxed">
              Sign in to manage tournaments, squads &amp; matches
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="flex-1 h-px bg-[#222]" />
            <span className="text-[#3a3a3a] text-[10px] uppercase tracking-[1.8px] whitespace-nowrap">
              Continue with
            </span>
            <div className="flex-1 h-px bg-[#222]" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-[#1c1c1c] hover:bg-[#232323] border border-[#2e2e2e] hover:border-[#3a3a3a] rounded-xl px-5 py-3.5 transition-colors duration-200 cursor-pointer relative z-10"
          >
            <svg width="20" height="20" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4"/>
              <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853"/>
              <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04"/>
              <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335"/>
            </svg>
            <span className="text-[#f0f0f0] text-sm font-medium">
              Sign in with Google
            </span>
          </button>

          {/* Feature strip */}
          <div className="flex justify-between gap-3 mt-7 pt-6 border-t border-[#1e1e1e] relative z-10">
            {[
              {
                label: "Squads & Teams",
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e8302a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
              },
              {
                label: "ELO Rankings",
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e8302a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
              },
              {
                label: "Prize Pools",
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e8302a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                    <line x1="10" y1="14" x2="14" y2="14"/>
                  </svg>
                ),
              },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-9 h-9 rounded-lg bg-[#111] border border-[#252525] flex items-center justify-center">
                  {f.icon}
                </div>
                <span className="text-[#555] text-[11px] text-center leading-tight">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[#3a3a3a] text-[11px] text-center mt-5 leading-relaxed">
          By signing in you agree to our{" "}
          <a href="/terms" className="text-[#555] underline underline-offset-2 hover:text-[#f0f0f0] transition-colors">Terms</a>{" "}
          and{" "}
          <a href="/privacy" className="text-[#555] underline underline-offset-2 hover:text-[#f0f0f0] transition-colors">Privacy Policy</a>.<br />
          Corpse Esports Private Limited · Karimganj, Assam
        </p>
      </div>
    </div>
  );
}