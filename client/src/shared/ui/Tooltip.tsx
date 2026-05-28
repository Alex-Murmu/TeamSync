import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./cn";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  content,
  children,
  side = "top",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute whitespace-nowrap bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm",
              "shadow-[0_4px_6px_rgba(0,0,0,0.2)]",
              "pointer-events-none z-50",
              positionStyles[side]
            )}
          >
            {content}
            <div
              className={cn(
                "absolute w-2 h-2 bg-gray-900 rotate-45",
                side === "top" && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
                side === "bottom" && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
                side === "left" && "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
                side === "right" && "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
