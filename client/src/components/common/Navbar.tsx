import React from 'react'
import { ModeToggle } from '../mode-toggle'
import { XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Singup } from '../landingpage/SignupDialog';

function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
  return <>
        <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">TeamSync</div>
        <div className='hidden md:flex gap-8 items-center'>
            <a className='text-foreground hover:text-primary transition-colors duration-200 font-medium' href="#home">Home</a>
            <a className='text-foreground hover:text-primary transition-colors duration-200 font-medium' href="#features">Features</a>
            <a className='text-foreground hover:text-primary transition-colors duration-200 font-medium' href="#testimonials">Testimonials</a>
            <Singup buttonText='Signup' />
            <ModeToggle />
        </div>
        {/* Mobile menu toggle button */}
        <div className='md:hidden flex items-center gap-4'>
            <ModeToggle />
            <button onClick={()=>setIsOpen(!isOpen)}>
                {isOpen ?<XCircle size={28} className="text-foreground" /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.633h16.5M3.75 12h16.5m-16.5 5.367h16.5" />
                </svg>}
            </button>
        </div>
    
        {isOpen && (
            <div className='absolute top-16 left-0 w-full flex flex-col items-center gap-4 py-4 md:hidden bg-card border-b border-border'>
                <a className='text-foreground hover:text-primary transition-colors duration-200 font-medium' href="#home">Home</a>
                <a className='text-foreground hover:text-primary transition-colors duration-200 font-medium' href="#features">Features</a>
                <a className='text-foreground hover:text-primary transition-colors duration-200 font-medium' href="#testimonials">Testimonials</a>
            </div>
        )}

 </>

  
}

export default Navbar