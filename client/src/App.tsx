import React from 'react'
import { ThemeProvider } from './components/theme-provider'
import  {Container}  from './components/common/container'
import Navbar from './components/common/Navbar'
import CTASection from './components/landingpage/CTASection'
import { Features } from './components/landingpage/Features'
function App() {
  return (
    <div className='w-screen'>
      <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme" >
      <Container className="w-full sticky top-0 left-0 right-0 flex justify-between h-16 backdrop-blur-md items-center z-50 ">
        <Navbar />
       </Container>
      <Container>
        <CTASection />
        <Features />
      </Container>
 
    </ThemeProvider>
    </div>
  )
}

export default App