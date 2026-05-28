import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SidePanelImage from "@/assets/side.jpg"
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "./ui/native-select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, registerUser } from "@/store/slices/authSlice";

interface SignupFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "ADMIN" | "MEMBER" | "";
}
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [shakePassword, setShakePassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);
  const authStatus = useAppSelector((state) => state.auth.status);
  const [SignupData, setSignupData] = useState<SignupFormProps>({
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
    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (!/[A-Z]/.test(value)) {
      return "Add at least 1 uppercase letter.";
    }
    if (!/[a-z]/.test(value)) {
      return "Add at least 1 lowercase letter.";
    }
    if (!/\d/.test(value)) {
      return "Add at least 1 number.";
    }
    return null;
  };

  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!SignupData.role) {
      toast.error("Please select a role");
      return;
    }
    const passwordIssue = validatePassword(SignupData.password);
    if (passwordIssue) {
      setPasswordError(passwordIssue);
      setShakePassword(true);
      return;
    }
    setIsSubmitting(true);
    const result = await dispatch(
      registerUser({
        firstName: SignupData.firstName,
        lastName: SignupData.lastName,
        email: SignupData.email,
        password: SignupData.password,
        role: SignupData.role as "ADMIN" | "MEMBER",
      })
    );
    if (registerUser.fulfilled.match(result)) {
      toast.success("Registration successful.");
      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
      });
      navigate("/dashboard");
    }
    setIsSubmitting(false);
  }
  
  const HandleInput = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
  };

  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={HandleSubmit} >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>
               <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      id="firstName"
                      type="text"
                      name="firstName"
                      required
                      value={SignupData.firstName}
                      onChange={HandleInput}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">
                     Last Name
                    </FieldLabel>
                    <Input
                      id="lastName"
                      type="text"
                      name="lastName"
                      required
                      value={SignupData.lastName}
                      onChange={HandleInput}
                    />
                  </Field>
                </Field>

              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  value={SignupData.email}
                  onChange={HandleInput}
                />
              </Field>
                <Field >
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      required
                      value={SignupData.password}
                      onChange={HandleInput}
                      className={shakePassword ? "shake border-destructive" : undefined}
                    />
                  </Field>
                  
                <FieldDescription className={passwordError ? "text-destructive" : undefined}>
                  {passwordError ?? "Must be at least 8 characters long."}
                </FieldDescription>
                <Field>
                  <FieldLabel  htmlFor="role">Role</FieldLabel>
                  <NativeSelect
                    id="role"
                   name="role"
                    value={SignupData.role}
                    onChange={HandleInput}
                  className="rounded-lg"> 
                    <NativeSelectOption>Select Role</NativeSelectOption>
                    <NativeSelectOption  value="MEMBER">Member</NativeSelectOption>
                    <NativeSelectOption  value="ADMIN">Admin</NativeSelectOption>
                  </NativeSelect>
                </Field>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting || authStatus === "loading"}>
                  {isSubmitting || authStatus === "loading" ? "Creating Account..." : "Create Account"}
                </Button>
              </Field>
              
              
              <FieldDescription className="text-center">
                Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={SidePanelImage}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover text-foreground bg-foreground/75"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
