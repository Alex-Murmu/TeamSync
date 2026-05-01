import React from 'react'
import { XCircle } from 'lucide-react';
import { ModeToggle } from '@/hooks/ModeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OnHoverOption } from './OnHoverOption';

function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    return <>
        <div className="font-bold text-xl text-foreground bg-clip-text ">TeamSync</div>
        <div className='hidden md:flex gap-8 items-center'>
            <a
                className='relative text-foreground hover:text-primary transition-colors duration-200 font-medium
                           after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full  after:w-full
                           after:bg-primary after:scale-x-50 after:transition-transform after:duration-300
                           hover:after:scale-x-100 after:origin-left 
            '
                href="#home"
            >
                Home
            </a>            <a className='relative text-foreground ho11ver:text-primary transition-colors duration-200 font-medium
                                          after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:w-full
                                          after:bg-gray-500 after:scale-x-50 after:transition-transform after:duration-300                                     
                                          hover:after:scale-x-100 after:origin-left active:after:bg-red-500
             '
                href="#features">
                Features</a>
            <a className='relative text-foreground hover:text-primary transition-colors  duration-200 font-medium
                          after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:w-full
                          after:bg-gray-400 after:scale-x-20 after:origin-left after:transition-transform after:duration-300
                          hover:after:scale-x-100 after:origin-left' href="#testimonials">Testimonials</a>
            <OnHoverOption ButtonText="Account" openDelay={100} closeDelay={200} />
            <ModeToggle />
        </div>
     
        {/* Mobile menu toggle button */}
        <div className='md:hidden flex items-center gap-4'>
            <ModeToggle />
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <XCircle size={28} className="text-foreground" /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-foreground">
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