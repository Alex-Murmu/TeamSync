import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectRole } from "./Role";
import image from "../../assets/form.png";
import { LoginForm } from "../loginPage/login-form";
import { AuthSidePanelImage } from "@/components/features/auth/shared";
import {
  useAuthDialogStore,
  useAuthStore,
  useSignUpFormStore,
} from "@/store";
import { authEndpoint } from "@/api";

interface SignupFormProps {
  className?: string;
  buttonTitle?: string;
  variant?: "default" | "outline" | "ghost";
  onSubmit?: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }) => void | Promise<void>;
}

export function SignupForm({
  className,
  buttonTitle = "Sign up",
  variant,
  onSubmit,
}: SignupFormProps) {
  const {
    isSignUpOpen,
    isLogInOpen,
    openSignUp,
    closeSignUp,
    openLogIn,
    closeLogIn,
    switchToLogIn,
    switchToSignUp,
  } = useAuthDialogStore();

  const { formData, loading, setField, setLoading, reset } = useSignUpFormStore();
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Please select a role");
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const data = await authEndpoint.signUp(formData);

        const user = data?.user ?? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
        };
        setAuthenticatedUser(user, data?.token ?? null);
      }

      closeSignUp();
      reset();
    } catch (error) {
      console.error("Signup error:", error);
      alert(error instanceof Error ? error.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={isSignUpOpen}
        onOpenChange={(open) => (open ? openSignUp() : closeSignUp())}
      >
        <DialogTrigger asChild>
          <Button variant={variant} onClick={openSignUp}>
            {buttonTitle}
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full sm:max-w-2xl lg:max-w-4xl">
          <DialogTitle className="hidden" />
          <div
            className={cn(
              "flex flex-col gap-6 bg-none overflow-hidden rounded-xl",
              className
            )}
          >
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-6 md:min-h[500px]" onSubmit={handleSubmit}>
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-sm text-muted-foreground">
                      Enter your email below to create your account
                    </p>
                  </div>

                  <Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                        <Input
                          id="first_name"
                          type="text"
                          placeholder="John"
                          required
                          disabled={loading}
                          value={formData.firstName}
                          onChange={(e) => setField("firstName", e.target.value)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                        <Input
                          id="last_name"
                          type="text"
                          placeholder="Doe"
                          required
                          disabled={loading}
                          value={formData.lastName}
                          onChange={(e) => setField("lastName", e.target.value)}
                        />
                      </Field>
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      disabled={loading}
                      value={formData.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      required
                      disabled={loading}
                      value={formData.password}
                      onChange={(e) => setField("password", e.target.value)}
                    />
                    <FieldDescription>At least 8 characters</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="role">Select Role</FieldLabel>
                    <SelectRole
                      value={formData.role}
                      onChange={(selectedRole) => setField("role", selectedRole)}
                      disabled={loading}
                    />
                  </Field>

                  <Field>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Creating account..." : "Create Account"}
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
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={switchToLogIn}
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </FieldDescription>
                </FieldGroup>
              </form>

              <AuthSidePanelImage imageSrc={image}>
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <h1 className="text-4xl lg:text-5xl font-black bg-linear-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent leading-tight">
                    Build Your World
                  </h1>
                  <motion.p
                    className="text-base leading-relaxed text-white/90 font-medium max-w-md"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    Block by block. Assemble your vision, dismantle friction,
                    rebuild workflows into an infinite, interconnected ecosystem of
                    possibilities. Your workspace, your rules, your velocity.
                  </motion.p>
                  <motion.div
                    className="pt-2 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                      God Mode Unlocked
                    </span>
                  </motion.div>
                </motion.div>
              </AuthSidePanelImage>
            </CardContent>
          </div>
        </DialogContent>
      </Dialog>

      <LoginForm
        open={isLogInOpen}
        onOpenChange={(open) => (open ? openLogIn() : closeLogIn())}
        onSwitchToSignUp={switchToSignUp}
      />
    </>
  );
}