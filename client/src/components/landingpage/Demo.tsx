import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,  
  DialogTrigger,
} from "@/components/ui/dialog"

export function DialogDemo() {
  return (
    <Dialog>
      <form >
        <DialogTrigger asChild>
          <Button variant="outline">Demo</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl lg:max-w-4xl">
          <video src={"/demo.mp4"} autoPlay loop muted className="rounded-md" />

        </DialogContent>
      </form>
    </Dialog>
  )
}
