import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import image from "@/assets/form.png";
import { AuthSidePanelImage } from "@/components/features/auth/shared";

interface LogInFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp?: () => void;
}

interface LogInFormData {
  email: string;
  password: string;
}

export function LogInForm({ open, onOpenChange, onSwitchToSignUp }: LogInFormProps) {
  const [formData, setFormData] = useState<LogInFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response:", data);
      onOpenChange(false);
      setFormData({ email: "", password: "" });
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl lg:max-w-4xl">
        <DialogTitle className="hidden" />
        <div className={cn("flex flex-col gap-6 bg-none overflow-hidden rounded-xl")}>
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-6 md:min-h[500px]" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-sm text-muted-foreground">Enter your email and password to continue</p>
                </div>

                <Field>
                  <FieldLabel htmlFor="login_email_v2">Email</FieldLabel>
                  <Input
                    id="login_email_v2"
                    type="email"
                    placeholder="m@example.com"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="login_password_v2">Password</FieldLabel>
                  <Input
                    id="login_password_v2"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </Field>

                <Field>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </Field>

                <FieldSeparator>Or continue with</FieldSeparator>

                <Field className="grid grid-cols-3 gap-4">
                  <Button variant="outline" type="button" disabled={loading}>Apple</Button>
                  <Button variant="outline" type="button" disabled={loading}>Google</Button>
                  <Button variant="outline" type="button" disabled={loading}>Meta</Button>
                </Field>

                <FieldDescription className="text-center">
                  Don't have an account?{" "}
                  <button type="button" onClick={onSwitchToSignUp} className="text-primary hover:underline">
                    Sign up
                  </button>
                </FieldDescription>
              </FieldGroup>
            </form>

            <AuthSidePanelImage imageSrc={image}>
              <h1 className="text-xl font-bold">Welcome back</h1>
              <p className="text-sm">To the Workspace</p>
            </AuthSidePanelImage>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  );
}
