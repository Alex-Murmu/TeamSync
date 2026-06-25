import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, loginUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import type { LoginPayload } from "@/api/endpoints/auth";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

export function LoginForm() {
  const [formData, setFormData] = useState<LoginPayload>({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);
  const authStatus = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(clearAuthError());
    }
  }, [authError, dispatch]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="w-full h-11 rounded-lg border border-white/8 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-[#7c6af7] focus:shadow-[0_0_0_3px_rgba(124,106,247,0.15)]"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
          <a href="#" className="text-xs text-[#7c6af7] hover:text-[#a78bfa] transition no-underline">Forgot password?</a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={handleInputChange}
          className="w-full h-11 rounded-lg border border-white/8 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-[#7c6af7] focus:shadow-[0_0_0_3px_rgba(124,106,247,0.15)]"
        />
      </div>
      <button
        type="submit"
        disabled={authStatus === "loading"}
        className="w-full h-11 rounded-full bg-white text-black font-semibold text-sm transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {authStatus === "loading" ? "Logging in..." : "Log in"}
      </button>
      <p className="text-center text-sm text-white/30">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-[#7c6af7] hover:text-[#a78bfa] font-medium no-underline transition">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;