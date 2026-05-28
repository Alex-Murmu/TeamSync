import { cn } from "./cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export function Input({
  error,
  label,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        className={cn(
          "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg",
          "shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]",
          "focus:outline-none focus:border-blue-500 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)]",
          "transition-all duration-200",
          "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60",
          error && "border-red-500 focus:border-red-500",
          className
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
