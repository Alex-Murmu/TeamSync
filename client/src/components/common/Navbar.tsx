import React from 'react'
import { ModeToggle } from '../mode-toggle'
import { XCircle } from 'lucide-react';
function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
  return <>
        <div>Logo</div>
        <div className='hidden md:flex gap-6'>
            <a className='hover:border-b-5' href="#home">Home</a>
            <a className='hover:border-b-5' href="#about">About</a>
            <a className='hover:border-b-5' href="#Projects">Projects</a>
            <ModeToggle />
        </div>
        {/* Mobile menu toggle button */}
        <div className='md:hidden'>
            <button onClick={()=>setIsOpen(!isOpen)}>
                {isOpen ?<XCircle size={28} /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.633h16.5M3.75 12h16.5m-16.5 5.367h16.5" />
                </svg>}
            </button>
        </div>
    
        {isOpen && (
            <div className='absolute top-16 left-0 w-full flex flex-col items-center gap-4 py-4 md:hidden'>
                <a className='hover:border-b-5' href="#home">Home</a>
                
                <a className='hover:border-b-5' href="#about">About</a>
                <a className='hover:border-b-5' href="#Projects">Projects</a>
                <ModeToggle />
            </div>
        )}

 </>

  
}

export default Navbar