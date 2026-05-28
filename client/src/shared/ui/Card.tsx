import { cn } from "./cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "sm" | "md" | "lg";
}

export function Card({
  elevation = "md",
  className,
  children,
  ...props
}: CardProps) {
  const elevations = {
    sm: "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
    md: "shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]",
    lg: "shadow-[0_10px_15px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]",
  };

  return (
    <div
      {...props}
      className={cn(
        "bg-white rounded-lg border border-gray-200",
        elevations[elevation],
        className
      )}
    >
      {children}
    </div>
  );
}
