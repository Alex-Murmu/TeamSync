import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Link } from "react-router-dom"

export function OnHoverOption({ButtonText,openDelay,closeDelay}: {ButtonText: string, openDelay?: number,closeDelay?: number}) {
  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>
        <Button>{ButtonText}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-26 flex-col gap-0.5">
        <Button  size="sm" className="justify-start">
          <Link to="/login">Login</Link>
        </Button>
        <Button  size="sm" className="justify-start">
           <Link to="/signup">Sign Up</Link>
        </Button>
      </HoverCardContent>
    </HoverCard>
  )
}
