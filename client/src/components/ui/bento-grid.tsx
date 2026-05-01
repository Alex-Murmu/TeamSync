import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BentoGridItem {
  id: string;
  colSpan?: number;
  rowSpan?: number;
  content: ReactNode;
}

interface BentoGridProps {
  className?: string;
  items?: BentoGridItem[];
  gridCols?: number;
  children?: ReactNode;
}

interface BentoGridItemProps {
  className?: string;
  children: ReactNode;
}

export function BentoGrid({ className, items, gridCols = 3, children }: BentoGridProps) {
  if (items) {
    return (
      <div
        className={cn(
          "grid gap-4 max-w-7xl mx-auto",
          gridCols === 2 && "grid-cols-1 md:grid-cols-2",
          gridCols === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          className
        )}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md",
              item.colSpan && `col-span-${item.colSpan}`,
              item.rowSpan && `row-span-${item.rowSpan}`
            )}
          >
            {item.content}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(200px,auto)] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({ className, children }: BentoGridItemProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}