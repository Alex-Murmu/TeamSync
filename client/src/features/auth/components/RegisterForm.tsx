import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "../api/authApi";
import { clearError } from "../slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    dispatch(
      registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>

      {(error || validationError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          {error || validationError}
          <button
            onClick={() => {
              dispatch(clearError());
              setValidationError(null);
            }}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">First Name</label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-4 text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in
        </a>
      </p>
    </Card>
  );
}
