import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SidePanelImage from "@/assets/side.jpg"
import { Link } from "react-router-dom";
import { useState } from "react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect ,NativeSelectOption } from "./ui/native-select";

interface SignupFormProps {
  firtName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
}
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const HandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
     
    
  }

  const [SignupData, setSignupData] = useState<SignupFormProps>({
    firtName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  
const HandleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                      name="firtName"
                      required
                      value={SignupData.firtName}
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
                   name="role"
                    value={SignupData.role}
                    onChange={HandleInput}
                  className="rounded-lg">
                    <NativeSelectOption  value="Member">Member</NativeSelectOption>
                    <NativeSelectOption  value="admin">Admin</NativeSelectOption>
                  </NativeSelect>
                </Field>
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
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
