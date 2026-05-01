import { SignupForm } from "@/components/signup-form"
import { Button } from "@/components/ui/button";
import { GoBackButton } from "@/hooks/BackForward";


export default function SignupPage() {
   
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
     
          <GoBackButton />

        <SignupForm />
      </div>
    </div>
  )
}
