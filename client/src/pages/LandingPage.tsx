import { Container } from "@/components/common/container";
import Navbar from "@/components/common/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import {
  CTASection,
  Contact,
  Features,
  Footer,
  Hero,
  Testimonials,
} from "@/components/features/landingpage";

export function LandingPage() {
  return (
    <div className="max-w-screen">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Container className="w-full sticky bg-none top-0 left-0 right-0 flex justify-between h-16 backdrop-blur-sm items-center z-50 bg-background/80">
          <Navbar />
        </Container>

        <Container className="h-auto">
          <CTASection />
          <Hero />
          <Features />
          <Testimonials />
          <Contact />
          <Footer />
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default LandingPage;
