import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectRole } from "./Role";
import image from "../../assets/form.png";
import { LoginForm } from "../loginPage/login-form";


// ✅ Create a proper interface that extends div props + custom props
interface SignupFormProps extends React.ComponentProps<"div"> {
  buttonTitle?: string;
  variant?: "default" | "outline" | "ghost";
  onSubmit?: (formData: FormData) => void | Promise<void>;
}
console.log("SignupForm component loaded");
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}


export function SignupForm({ className, buttonTitle = "Sign up", variant, onSubmit, ...props }: SignupFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const fallbackImage = "/images/signup-bg.jpg";

  // ✅ Handle form submission
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
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log("Signup response:", data);
      }
      setIsOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle role selection
  const handleRoleChange = (selectedRole: string) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleOpenLogin = () => {
    setIsOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>{buttonTitle}</Button>
      </DialogTrigger>

      <DialogContent className="w-full sm:max-w-2xl lg:max-w-4xl">
        <DialogTitle className="hidden"></DialogTitle>
        <div
          className={cn(
            "flex flex-col gap-6 bg-none overflow-hidden rounded-xl",
            className
          )}
          {...props}
        >
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* ✅ Form with proper submission handler */}
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <FieldDescription>At least 8 characters</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="role">Select Role</FieldLabel>
                  {/* ✅ Pass onChange handler to SelectRole */}
                  <SelectRole
                    value={formData.role}
                    onChange={handleRoleChange}
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
                    onClick={handleOpenLogin}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </FieldDescription>
              </FieldGroup>
            </form>

            {/* Grid Distortion Image */}
            <div className="relative hidden bg-muted md:block h-full">
              {/* Added h-full and a min-height to ensure space is carved out */}

              <div className="absolute bottom-5 text-white z-20 w-full flex flex-col pl-10 gap-2">
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
                    Block by block. Assemble your vision, dismantle friction, rebuild workflows into an infinite, interconnected ecosystem of possibilities. Your workspace, your rules, your velocity.
                  </motion.p>
                  <motion.div
                    className="pt-2 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">God Mode Unlocked</span>
                  </motion.div>
                </motion.div>
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
    <LoginForm
      open={isLoginOpen}
      onOpenChange={setIsLoginOpen}
      onSwitchToSignUp={() => {
        setIsLoginOpen(false);
        setIsOpen(true);
      }}
    />
    </>
  );
}