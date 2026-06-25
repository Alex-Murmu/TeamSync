import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-10 sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white no-underline">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
          </svg>
          TeamSync
        </Link>
        <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1">
          <Link to="/features" className="text-white/60 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/5 transition no-underline">Features</Link>
          <Link to="/how" className="text-white/60 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/5 transition no-underline">How it works</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-white/60 hover:text-white transition no-underline">Sign in</Link>
          <Link to="/signup" className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition no-underline">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative text-center px-6 pt-20 pb-10 max-w-4xl mx-auto">
        <div className="hero-gradient absolute inset-0 -z-10" />
        <h1 className="hero-title mb-5">
          Team collaboration,<br />
          <span className="text-[#7c6af7] font-light">reimagined for the modern team.</span>
        </h1>
        <p className="hero-subtitle mb-9">
          TeamSync brings projects, tasks, chat, and calls into one unified workspace — so your team stays aligned and ships faster.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="purple-btn">
            Start for free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link to="/features" className="text-sm font-medium text-white/50 hover:text-white transition no-underline px-4 py-3">
            Explore features →
          </Link>
        </div>
      </section>

      {/* ── Mockup / App Preview ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-white/8 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_40px_100px_rgba(0,0,0,0.8)] bg-[#0a0a0c]">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"/>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]"/>
            <div className="w-3 h-3 rounded-full bg-[#28c840]"/>
            <div className="ml-4 flex-1 h-6 bg-white/3 rounded-md" />
          </div>
          <div className="grid grid-cols-12 min-h-[320px]">
            <div className="col-span-3 border-r border-white/5 p-4 space-y-3">
              <div className="h-3 w-3/4 bg-white/8 rounded" />
              <div className="h-3 w-1/2 bg-white/5 rounded" />
              <div className="h-3 w-2/3 bg-white/5 rounded" />
              <div className="h-3 w-1/3 bg-white/5 rounded" />
              <div className="h-3 w-2/3 bg-white/5 rounded" />
            </div>
            <div className="col-span-9 p-6 space-y-4">
              <div className="h-4 w-1/3 bg-white/8 rounded" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 rounded-xl border border-white/6 bg-white/2" />
                <div className="h-24 rounded-xl border border-white/6 bg-white/2" />
                <div className="h-24 rounded-xl border border-white/6 bg-white/2" />
              </div>
              <div className="h-4 w-1/4 bg-white/6 rounded mt-6" />
              <div className="space-y-2">
                <div className="h-10 rounded-lg border border-white/5 bg-white/2" />
                <div className="h-10 rounded-lg border border-white/5 bg-white/2" />
                <div className="h-10 rounded-lg border border-white/5 bg-white/2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="purple-pill mb-4 mx-auto w-fit">Features</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white/90">
            Everything your team needs,<br />in one place.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: "Project Management", desc: "Create projects, set milestones, and track progress with full visibility across your workspace." },
            { title: "Task Tracking", desc: "Assign, prioritize, and update tasks in real time. Never miss a deadline again." },
            { title: "Real-time Chat", desc: "Direct messages and group conversations — with typing indicators and read receipts." },
            { title: "Video & Voice Calls", desc: "Jump on a call without leaving the workspace. Screen sharing and call recording coming soon." },
            { title: "Workspaces", desc: "Organize teams by workspace. Invite members, manage roles, and control access." },
            { title: "Analytics", desc: "Track team velocity, project health, and workload distribution at a glance." },
          ].map((f, i) => (
            <div key={i} className="feature-card rounded-2xl">
              <div className="w-9 h-9 rounded-lg border border-white/8 bg-white/4 flex items-center justify-center mb-5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M9 12h6M12 9v6" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-white/85 mb-2">{f.title}</h3>
              <p className="text-[13px] text-white/35 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="purple-pill mb-4 mx-auto w-fit">How it works</p>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white/90 mb-16">Up in 60 seconds</h2>
        <div className="text-left space-y-0">
          {[
            { step: "1", title: "Create an account", desc: "Sign up with your email or Google account. No credit card required for the free tier." },
            { step: "2", title: "Set up your workspace", desc: "Name your workspace, invite teammates, and assign roles." },
            { step: "3", title: "Start collaborating", desc: "Create projects, assign tasks, and jump into chat or calls — all from one dashboard." },
          ].map((s, i) => (
            <div key={i} className="step-line flex gap-5">
              <div className="w-8 h-8 rounded-full border border-white/10 bg-white/3 flex items-center justify-center text-xs font-medium text-[#7c6af7] shrink-0">{s.step}</div>
              <div className="pb-10">
                <h3 className="text-sm font-medium text-white/85 mb-1">{s.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="purple-pill mb-4 mx-auto w-fit">Tech Stack</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white/90">Built with modern tools</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "React", role: "Frontend framework" },
            { name: "TypeScript", role: "Type safety" },
            { name: "Tailwind CSS", role: "Styling" },
            { name: "Node.js", role: "Backend runtime" },
            { name: "Express", role: "API server" },
            { name: "MongoDB", role: "Database" },
            { name: "Socket.io", role: "Real-time" },
            { name: "JWT", role: "Authentication" },
          ].map((t, i) => (
            <div key={i} className="rounded-xl border border-white/6 bg-white/2 p-5">
              <p className="text-sm font-medium text-white/75 mb-1">{t.name}</p>
              <p className="text-xs text-white/30">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="text-center px-6 py-28">
        <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white/90 mb-5">
          Ready to sync up?
        </h2>
        <p className="text-white/35 text-base mb-9 max-w-md mx-auto leading-relaxed">
          Join teams already using TeamSync to ship faster and stay aligned.
        </p>
        <Link to="/signup" className="purple-btn">
          Get started for free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 md:px-10 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/25">
        <span>© 2026 TeamSync. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white/50 transition no-underline text-white/25">Privacy</a>
          <a href="#" className="hover:text-white/50 transition no-underline text-white/25">Terms</a>
          <a href="#" className="hover:text-white/50 transition no-underline text-white/25">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;