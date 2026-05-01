import { Container } from "@/components/common/container";
import Navbar from "@/components/common/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/grid-background";
import {
  CTASection,

  
  Contact,
  Features,
  Footer,
  Hero,
  Testimonials,
} from "../components/landingpage";

export function LandingPage() {
  return (
    <div className="max-w-screen relative">
      <GridBackground
        className="fixed inset-x-0 z-0 w-screen h-screen p-50"
        opacity={10}
        gridSize={20}
      />

      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Container className="w-full sticky bg-none top-0 left-0 right-0 flex justify-between h-16 backdrop-blur-sm items-center z-50">
          <Navbar />
        </Container>

        <Container className="h-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <CTASection />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <Hero />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <Features />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            <Testimonials />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            <Contact />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
          >
            <Footer  />
          </motion.div>          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >

          </motion.div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default LandingPage;
