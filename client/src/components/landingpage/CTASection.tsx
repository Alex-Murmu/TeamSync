"use client"
import { motion } from "framer-motion"
import  DialogDemo  from "./Demo"

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, x: -150, y: 1 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
      className="relative py-4 px-6 overflow-hidden">

      <div className="absolute inset-100 bg-gradient-to-c from-purple-600/20 via-blue-500/10 to-transparent dark:from-purple-900/30 dark:via-blue-900/20 blur-3xl" />

      <div className="relative max-w-5xl mx-auto">

        <div
          className="rounded-3xl p-10 text-center bg-primary/5 dark:bg-primary/10 backdrop-blur-sm border border-border"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Stop Managing Tasks.
            <span className="block bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Start Finishing Them.
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Organize your workflow, collaborate with your team, and boost productivity — all in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center mb-0">
            <DialogDemo />
          </div>

        </div>
      </div>
    </motion.section>
  )
}