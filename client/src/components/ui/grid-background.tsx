import { cn } from '@/lib/utils';

interface GridBackgroundProps {
  className?: string;
  opacity?: number;
  gridSize?: number;
  animate?: boolean;
  speedSeconds?: number;
  animateOnHover?: boolean;
}

export function GridBackground({
  className,
  opacity = 60,
  gridSize = 100,
  animate = true,
  speedSeconds = 200,
  animateOnHover = false,
}: GridBackgroundProps) {
  const hoverClasses = animateOnHover
    ? "[animation-play-state:paused] group-hover:[animation-play-state:running]"
    : "";

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      style={{
        opacity,
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, transparent 8%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, transparent 92%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, transparent 8%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, transparent 92%, transparent 100%)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    >
      {animate && (
        <style>{`
          @keyframes grid-pan {
            0% { background-position: 0 0, 0 0; }
            100% { background-position: ${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px; }
          }
        `}</style>
      )}
      {/* Primary grid - static and clean */}
      <div
        className={cn("absolute inset-0", hoverClasses)}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          animation: animate ? `grid-pan ${speedSeconds}s linear infinite` : undefined,
          filter: "blur(0.2px)",
        }}
      />
      <div
        className={cn("absolute inset-0 opacity-0 dark:opacity-100", hoverClasses)}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          animation: animate ? `grid-pan ${speedSeconds}s linear infinite` : undefined,
          filter: "blur(0.2px)",
        }}
      />

      {/* Parallax grid - larger and even softer */}
      <div
        className={cn("absolute inset-0", hoverClasses)}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * 2}px ${gridSize * 2}px`,
          animation: animate ? `grid-pan ${speedSeconds * 1.6}s linear infinite` : undefined,
          filter: "blur(0.4px)",
        }}
      />
      <div
        className={cn("absolute inset-0 opacity-0 dark:opacity-100", hoverClasses)}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * 2}px ${gridSize * 2}px`,
          animation: animate ? `grid-pan ${speedSeconds * 1.6}s linear infinite` : undefined,
          filter: "blur(0.4px)",
        }}
      />
    </div>
  );
}