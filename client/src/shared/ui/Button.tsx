import { cn } from "./cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
    secondary:
      "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 shadow-[0_4px_6px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger:
      "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg",
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
