import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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

  // 4. Letter Animation (Spring Load + Hover Fly + Floating)
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
    floating: {
      y: [0, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
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
          />
        ))}
      </span>
    </motion.h1>
  );
}


function Letter({ char, index, progress, variants, className = "" }: LetterProps) {
  
  // Enhanced scroll transformations with spring smoothing
  const rawScrollY = useTransform(progress, [0, 1], [0, (index % 3 + 1) * -150]);
  const rawScrollX = useTransform(progress, [0, 1], [0, (index - 15) * 10]);
  const rawScrollOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const rawScrollRotate = useTransform(progress, [0, 1], [0, (index % 2 === 0 ? 1 : -1) * 30]);
  const rawScrollScale = useTransform(progress, [0, 0.8], [1, 0.9]);
  const rawScrollBlur = useTransform(progress, [0, 0.6], [0, 3]);

  // Apply spring smoothing
  const scrollY = useSpring(rawScrollY, { stiffness: 100, damping: 30 });
  const scrollX = useSpring(rawScrollX, { stiffness: 100, damping: 30 });
  const scrollOpacity = useSpring(rawScrollOpacity, { stiffness: 100, damping: 30 });
  const scrollRotate = useSpring(rawScrollRotate, { stiffness: 100, damping: 30 });
  const scrollScale = useSpring(rawScrollScale, { stiffness: 100, damping: 30 });
  const scrollBlur = useSpring(rawScrollBlur, { stiffness: 100, damping: 30 });

  return (
    <motion.span
      custom={index}
      variants={variants}
      animate="floating"
      whileHover="hoverFly"
      style={{ 
        y: scrollY, 
        x: scrollX, 
        opacity: scrollOpacity, 
        rotate: scrollRotate,
        scale: scrollScale,
        filter: `blur(${scrollBlur}px)`,
        display: "inline-block" 
      }}
      className={className}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}