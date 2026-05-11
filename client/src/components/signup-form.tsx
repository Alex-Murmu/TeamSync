import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SidePanelImage from "@/assets/side.jpg"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect ,NativeSelectOptGroup,NativeSelectOption } from "./ui/native-select";
import { BaseUrl } from "./common";

interface SignupFormProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
}
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [SignupData, setSignupData] = useState<SignupFormProps>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
   console.log("Submitting Signup Data:", SignupData);
    try {
      const response = await fetch(BaseUrl+"/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(SignupData),
      });

      const result = await response.json();
      if(result?.success){
        toast.success(result.message || "Registration successful");
        setSignupData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
        });
        navigate("/verify");
      } else {
        throw new Error(result?.message || "Registration failed");
      }

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Registration failed");
      }
    } catch (error:any) {
      console.log("Signup error:", error.message);
      const message = error instanceof Error ? error.message : "Unable to register";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }
  
const HandleInput = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = event.target;
  setSignupData((prevData) => ({
    ...prevData,
    [name]: value,
  }));

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
                    />
                  </Field>
                  
                <FieldDescription>
                  Must be at least 8 characters long.
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
                    <NativeSelectOption  value="Member">Member</NativeSelectOption>
                    <NativeSelectOption  value="Admin">Admin</NativeSelectOption>
                  </NativeSelect>
                </Field>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
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
