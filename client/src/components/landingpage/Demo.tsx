import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,  
  DialogTitle,  
  DialogTrigger,
} from "@/components/ui/dialog"

export function DialogDemo({variant, buttonTitle = "Demo"}: {variant?: "default" | "outline" | "ghost", buttonTitle?: string }) {
  return (
    <Dialog>
      <form >
        <DialogTrigger asChild>
          <Button variant={variant}>{buttonTitle}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl lg:max-w-4xl">
          <DialogTitle className="hidden"></DialogTitle>
          <video src={"/demo.mp4"} autoPlay loop muted className="rounded-md" />
        </DialogContent>
      </form>
    </Dialog>
  )
}
