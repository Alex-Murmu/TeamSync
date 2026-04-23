import { Singup } from './SignupDialog'
import { motion } from 'framer-motion'
function Hero() {
    return (
        <motion.section
         initial={{ opacity: 0, x: 150, y: -150 }}
         whileInView={{ opacity: 1, x: 0, y: 0 }}
         transition={{
         duration: 0.8,
         ease: "easeOut",
         delay: 0.6
  }}
  viewport={{ once: true }}
        className="relative flex flex-col items-center justify-center pt-20 pb-16 px-4 min-h-[600px]">
            <h1 className="max-w-4xl text-center text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
                Manage tasks without the <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">chaos.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-center text-lg text-muted-foreground">
                TeamSync brings your team's goals, tasks, and files together. Stop searching through tabs and start shipping.
            </p>

            <div className="mt-10 flex items-center gap-x-6">
                <Singup />
            </div>


        </motion.section>

    )
}

export default Hero