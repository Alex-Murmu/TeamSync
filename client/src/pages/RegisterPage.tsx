import { SignupForm } from "@/components/signup-form";

export function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#7c6af7]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-[#7c6af7]/6 rounded-full blur-[100px]" />
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
              <h1 className="text-2xl font-normal text-white/90 mb-2 tracking-tight">Create your account</h1>
              <p className="text-sm text-white/35 mb-8">Start collaborating with your team today.</p>
              <SignupForm />
              <p className="mt-6 text-center text-sm text-white/30">
                Already have an account?{" "}
                <a href="/login" className="text-[#7c6af7] hover:text-[#a78bfa] transition no-underline font-medium">
                  Log in
                </a>
              </p>
            </div>

            {/* Right - Visual */}
            <div className="hidden md:flex relative bg-[#0f0f12] items-center justify-center p-10 border-l border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7c6af7]/5 to-transparent" />
              <div className="relative text-center">
                <div className="w-20 h-20 rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white/80 mb-2">Join your team</h3>
                <p className="text-sm text-white/30 leading-relaxed max-w-[200px] mx-auto">
                  Create an account and start collaborating in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;