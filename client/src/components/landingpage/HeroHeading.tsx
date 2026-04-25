import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue, Variants } from "framer-motion";

// 1. Define the Types for TypeScript Safety
interface LetterProps {
  char: string;
  index: number;
  progress: MotionValue<number>;
  variants: Variants;
  className?: string;
}

export function HeroHeading() {
  const text = "Manage tasks without the ";
  const gradientText = "chaos.";

  // 2. Setup Scroll Tracking
  const { scrollYProgress } = useScroll();

  // 3. Initial Animation (Staggered Load)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.03, 
      },
    },
  };

  // 4. Letter Animation (Spring Load + Hover Fly)
  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hoverFly: (i: number) => ({
      y: -25,
      x: (i - 15) * 1.5,
      opacity: 0.7,
      filter: "blur(1px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.h1
      className="max-w-4xl cursor-default text-center text-5xl font-bold tracking-tight text-foreground sm:text-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Regular Text */}
      {text.split("").map((char, index) => (
        <Letter 
          key={`normal-${index}`} 
          char={char} 
          index={index} 
          progress={scrollYProgress} 
          variants={letterVariants} 
        />
      ))}

      {/* Gradient Text */}
      <span className="inline-block">
        {gradientText.split("").map((char, index) => (
          <Letter
            key={`gradient-${index}`}
            char={char}
            index={index + text.length}
            progress={scrollYProgress}
            variants={letterVariants}
            className="bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
          />
        ))}
      </span>
    </motion.h1>
  );
}


function Letter({ char, index, progress, variants, className = "" }: LetterProps) {
  
  // Cleaned up the hooks: No double commas, and all ranges are complete.
  const scrollY = useTransform(progress, [0, 1], [0, (index % 3 + 1) * -150]);
  const scrollX = useTransform(progress, [0, 1], [0, (index - 15) * 10]);
  const scrollOpacity = useTransform(progress, [0, 0.6], [1, 0.35]);
  const scrollRotate = useTransform(progress, [0, 1], [0, (index % 2 === 0 ? 1 : -1) * 30]);

  return (
    <motion.span
      custom={index}
      variants={variants}
      whileHover="hoverFly"
      style={{ 
        y: scrollY, 
        x: scrollX, 
        opacity: scrollOpacity, 
        rotate: scrollRotate, 
        display: "inline-block" 
      }}
      className={className}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}