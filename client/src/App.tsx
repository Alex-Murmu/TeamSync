import { ThemeProvider } from './components/theme-provider'
import { Container } from './components/common/container'
import Navbar from './components/common/Navbar'
import CTASection from './components/landingpage/CTASection'
import Hero from './components/landingpage/Hero'
import Features from './components/landingpage/Features'
import Testimonials from './components/landingpage/Testimonials'
import Footer from '@/components/landingpage/Footer'
import Contact from '@/components/landingpage/Contact'
function App() {
  return (
    <div className='max-w-screen '>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" >
        <Container className="w-full sticky bg-none top-0 left-0 right-0 flex justify-between h-16 backdrop-blur-sm items-center z-50 bg-background/80">
          <Navbar />
          </Container>
          <Container className=' h-auto'>
          <CTASection />
          <Hero />
          <Features />
          <Testimonials />
          <Contact />
          <Footer />
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default App