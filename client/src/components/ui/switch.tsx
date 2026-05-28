import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  disabled,
}: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = typeof checked === "boolean";
  const isOn = isControlled ? checked : internal;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) {
      setInternal(next);
    }
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={handleToggle}
      disabled={disabled}
      className={cn(
        "inline-flex h-6 w-11 items-center rounded-full border border-transparent transition",
        isOn ? "bg-primary" : "bg-input",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
    >
      <span
        className={cn(
          "block h-5 w-5 rounded-full bg-background shadow-sm transition-transform",
          isOn ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
