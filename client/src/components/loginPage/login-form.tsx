import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import GridDistortion from "../GridDistortion";
import "@/components/GridDistortion.css";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import image from "../../assets/form.png";

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
   onSwitchToSignUp?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm({
  open,
  onOpenChange,
  onSwitchToSignUp,
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const fallbackImage = "/images/signup-bg.jpg";

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
                  <p className="text-sm text-muted-foreground">
                    Enter your email and password to continue
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="login_email">Email</FieldLabel>
                  <Input
                    id="login_email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="login_password">Password</FieldLabel>
                  <Input
                    id="login_password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </Field>

                <FieldSeparator>Or continue with</FieldSeparator>

                <Field className="grid grid-cols-3 gap-4">
                  <Button variant="outline" type="button" disabled={loading}>
                    Apple
                  </Button>
                  <Button variant="outline" type="button" disabled={loading}>
                    Google
                  </Button>
                  <Button variant="outline" type="button" disabled={loading}>
                    Meta
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </FieldDescription>
              </FieldGroup>
            </form>

            <div className="relative hidden bg-muted md:block h-full">
              <div className="absolute bottom-5 text-white z-20 w-full flex flex-col pl-10 gap-2">
                <h1 className="text-xl font-bold">Welcome back</h1>
                <p className="text-sm">To the Workspace</p>
              </div>

              <div className="absolute inset-0 w-full h-full overflow-hidden rounded-r-xl">
                <GridDistortion
                  imageSrc={image || fallbackImage}
                  grid={15}
                  mouse={0.1}
                  strength={0.15}
                  relaxation={0.9}
                  className="w-full h-full"
                />
              </div>
            </div>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  );
}