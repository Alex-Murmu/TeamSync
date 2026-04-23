import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,  
  DialogTrigger,
} from "@/components/ui/dialog"
import { SignupForm } from "../signup-form"

export function Singup({buttonText = "Get started",variant}: React.ComponentProps<"button"> & {buttonText?: string,variant?: "outline" | "default"}) {
  return (
    <Dialog>
      <form >
        <DialogTrigger asChild>
          <Button variant={variant}>{buttonText}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl lg:max-w-4xl">
          <SignupForm />

        </DialogContent>
      </form>
    </Dialog>
  )
}
