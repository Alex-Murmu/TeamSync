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
import image from "../../assets/form.png";
import { AuthSidePanelImage } from "@/components/features/auth/shared";
import { useAuthStore, useLogInFormStore } from "@/store";
import { authEndpoint } from "@/api";

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp?: () => void;
}

export function LoginForm({
  open,
  onOpenChange,
  onSwitchToSignUp,
}: LoginFormProps) {
  const { formData, loading, setField, setLoading, reset } = useLogInFormStore();
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const data = await authEndpoint.logIn(formData);

      const user = data?.user ?? { email: formData.email };
      setAuthenticatedUser(user, data?.token ?? null);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Login error:", error);
      alert(error instanceof Error ? error.message : "Login failed. Please try again.");
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
                    onChange={(e) => setField("email", e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="login_password">Password</FieldLabel>
                  <Input
                    id="login_password"
                    type="password"
                    placeholder="********"
                    required
                    disabled={loading}
                    value={formData.password}
                    onChange={(e) => setField("password", e.target.value)}
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