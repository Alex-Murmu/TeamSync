import { cn } from "./cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  height?: string;
}

export function Skeleton({
  count = 1,
  height = "h-4",
  className,
  ...props
}: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          {...props}
          className={cn(
            height,
            "bg-gray-200 rounded animate-pulse mb-3 last:mb-0",
            className
          )}
        />
      ))}
    </>
  );
}
