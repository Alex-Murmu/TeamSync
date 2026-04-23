import React from 'react'
import { ThemeProvider } from './components/theme-provider'
import  {Container}  from './components/common/container'
import Navbar from './components/common/Navbar'
import CTASection from './components/landingpage/CTASection'
import Hero from './components/landingpage/Hero'
import Features from './components/landingpage/Features'
import Testimonials from './components/landingpage/Testimonials'
import Footer from '@/components/landingpage/Footer'

function App() {
  return (
    <div className='w-screen'>
      <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme" >
        <Container className="w-full sticky top-0 left-0 right-0 flex justify-between h-16 backdrop-blur-md items-center z-50 bg-background/80">
          <Navbar />
        </Container>
        <Container className='w-full h-auto'>
          <CTASection />
        </Container>
        
        <Hero />
        <Features />
        <Testimonials />
        <Footer />
      </ThemeProvider>
    </div>
  )
}

export default App