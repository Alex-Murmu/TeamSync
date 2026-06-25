import { LoginForm } from "@/components/login-form";
import { useState } from "react";

export function LoginPage() {
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#7c6af7]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-[#7c6af7]/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[300px] bg-[#7c6af7]/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="rounded-2xl border border-white/6 overflow-hidden bg-[#0a0a0c]/80 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_40px_80px_rgba(0,0,0,0.7)]">
          <div className="grid md:grid-cols-2">
            {/* Left - Form */}
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-2 mb-10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
                </svg>
                <span className="text-lg font-semibold text-white">TeamSync</span>
              </div>
              <h1 className="text-2xl font-normal text-white/90 mb-2 tracking-tight">Welcome back</h1>
              <p className="text-sm text-white/35 mb-8">Log in to your workspace to continue.</p>
              <LoginForm />
              <p className="mt-6 text-center text-sm text-white/30">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="text-[#7c6af7] hover:text-[#a78bfa] transition no-underline font-medium">
                  Sign up
                </a>
              </p>
            </div>

            {/* Right - Visual */}
            <div className="hidden md:flex relative bg-[#0f0f12] items-center justify-center p-10 border-l border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7c6af7]/5 to-transparent" />
              <div className="relative text-center">
                <div className="w-20 h-20 rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white/80 mb-2">Your team, unified.</h3>
                <p className="text-sm text-white/30 leading-relaxed max-w-[200px] mx-auto">
                  Projects, tasks, chat, and calls — all in one workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;