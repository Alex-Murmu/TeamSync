"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { DialogDemo } from "./Demo"

export default function CTASection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden h-screen">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-500/10 to-transparent blur-3xl" />

      <div className="relative max-w-5xl mx-auto">
        <div className="rounded-3xl border bg-background/60 backdrop-blur-xl p-10 text-center shadow-xl">
          
          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Stop Managing Tasks.
            <span className="block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Start Finishing Them.
            </span>
          </h2>

          {/* Subtext */}
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Organize your workflow, collaborate with your team, and boost productivity — all in one place.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            
            {/* Primary CTA */}
            <Button
              size="lg"
              className="group relative overflow-hidden px-6"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>

              {/* Glow effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition duration-300 blur-xl" />
            </Button>

            {/* Secondary CTA */}
             <DialogDemo />
          </div>

        </div>
      </div>
    </section>
  )
}