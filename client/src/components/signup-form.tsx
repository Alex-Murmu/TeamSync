import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, registerUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [shakePassword, setShakePassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);
  const authStatus = useAppSelector((state) => state.auth.status);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(clearAuthError());
    }
  }, [authError, dispatch]);

  useEffect(() => {
    if (!shakePassword) return;
    const timer = setTimeout(() => setShakePassword(false), 400);
    return () => clearTimeout(timer);
  }, [shakePassword]);

  const validatePassword = (value: string) => {
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Add at least 1 uppercase letter.";
    if (!/[a-z]/.test(value)) return "Add at least 1 lowercase letter.";
    if (!/\d/.test(value)) return "Add at least 1 number.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }
    const passwordIssue = validatePassword(formData.password);
    if (passwordIssue) {
      setPasswordError(passwordIssue);
      setShakePassword(true);
      return;
    }
    setIsSubmitting(true);
    const result = await dispatch(
      registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role as "ADMIN" | "MEMBER",
      })
    );
    if (registerUser.fulfilled.match(result)) {
      toast.success("Registration successful.");
      setFormData({ firstName: "", lastName: "", email: "", password: "", role: "" });
      navigate("/dashboard");
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">First name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="John"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full h-11 rounded-lg border border-white/8 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-[#7c6af7] focus:shadow-[0_0_0_3px_rgba(124,106,247,0.15)]"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Last name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Doe"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full h-11 rounded-lg border border-white/8 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-[#7c6af7] focus:shadow-[0_0_0_3px_rgba(124,106,247,0.15)]"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="w-full h-11 rounded-lg border border-white/8 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-[#7c6af7] focus:shadow-[0_0_0_3px_rgba(124,106,247,0.15)]"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Min. 8 characters"
          required
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full h-11 rounded-lg border bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:shadow-[0_0_0_3px_rgba(124,106,247,0.15)] ${shakePassword ? "border-[#f87171] shake" : "border-white/8 focus:border-[#7c6af7]"}`}
        />
        <p className={`mt-2 text-xs ${passwordError ? "text-[#f87171]" : "text-white/25"}`}>
          {passwordError ?? "Must be at least 8 characters long."}
        </p>
      </div>
      <div>
        <label htmlFor="role" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="w-full h-11 rounded-lg border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all focus:border-[#7c6af7] focus:shadow-[0_0_0_3px_rgba(124,106,247,0.15)] appearance-none"
        >
          <option value="" disabled className="bg-[#1a1a1f] text-white/50">Select a role</option>
          <option value="MEMBER" className="bg-[#1a1a1f]">Member</option>
          <option value="ADMIN" className="bg-[#1a1a1f]">Admin</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || authStatus === "loading"}
        className="w-full h-11 rounded-full bg-white text-black font-semibold text-sm transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting || authStatus === "loading" ? "Creating Account..." : "Create Account"}
      </button>
      <p className="text-center text-sm text-white/30">
        Already have an account?{" "}
        <Link to="/login" className="text-[#7c6af7] hover:text-[#a78bfa] font-medium no-underline transition">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;