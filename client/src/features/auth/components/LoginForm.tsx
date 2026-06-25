import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@shared/hooks/redux";
import { loginUser } from "../api/authApi";
import { clearError } from "../slices/authSlice";
import { Button, Input, Card } from "@shared/ui";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          {error}
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={status === "loading"}
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-4 text-center text-gray-600 text-sm">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </a>
      </p>
    </Card>
  );
}
