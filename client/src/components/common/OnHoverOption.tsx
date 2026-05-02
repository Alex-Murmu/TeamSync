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
      <HoverCardContent className="flex w-26 flex-col  rounded-none shadow-0">
          <Link className="hover:bg-gray-300 p-2" to="/login">Login</Link>
          <Link className="hover:bg-gray-300 p-2" to="/signup">Sign Up</Link>
      </HoverCardContent>
    </HoverCard>
  )
}
