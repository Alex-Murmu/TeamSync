import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@/components/theme-provider'
import App from './App.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { Provider } from "react-redux"
import { store } from "@/store"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <TooltipProvider>
          <App />
          <Toaster />
        </TooltipProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
)
