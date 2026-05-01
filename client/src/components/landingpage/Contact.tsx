'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

type CelebrationStage = 'idle' | 'shake' | 'shrink' | 'burst' | 'success'

const confettiPieces = [
  { id: 1, className: 'bg-sky-400 dark:bg-sky-300', x: -180, y: -120, rotate: -40, delay: 0 },
  { id: 2, className: 'bg-amber-400 dark:bg-amber-300', x: -120, y: -170, rotate: 26, delay: 0.04 },
  { id: 3, className: 'bg-rose-400 dark:bg-rose-300', x: -60, y: -140, rotate: 72, delay: 0.08 },
  { id: 4, className: 'bg-emerald-400 dark:bg-emerald-300', x: 30, y: -185, rotate: -18, delay: 0.12 },
  { id: 5, className: 'bg-fuchsia-400 dark:bg-fuchsia-300', x: 95, y: -150, rotate: 54, delay: 0.16 },
  { id: 6, className: 'bg-cyan-400 dark:bg-cyan-300', x: 160, y: -115, rotate: 14, delay: 0.2 },
  { id: 7, className: 'bg-yellow-300 dark:bg-yellow-200', x: -205, y: -25, rotate: 35, delay: 0.24 },
  { id: 8, className: 'bg-orange-400 dark:bg-orange-300', x: -145, y: 10, rotate: -62, delay: 0.28 },
  { id: 9, className: 'bg-lime-400 dark:bg-lime-300', x: -70, y: -10, rotate: 18, delay: 0.32 },
  { id: 10, className: 'bg-indigo-400 dark:bg-indigo-300', x: 15, y: 15, rotate: -34, delay: 0.36 },
  { id: 11, className: 'bg-pink-400 dark:bg-pink-300', x: 105, y: -5, rotate: 81, delay: 0.4 },
  { id: 12, className: 'bg-teal-400 dark:bg-teal-300', x: 190, y: 20, rotate: -22, delay: 0.44 },
  { id: 13, className: 'bg-white/90 dark:bg-white/80', x: -150, y: 120, rotate: 12, delay: 0.48 },
  { id: 14, className: 'bg-blue-300 dark:bg-blue-200', x: -70, y: 155, rotate: -48, delay: 0.52 },
  { id: 15, className: 'bg-purple-300 dark:bg-purple-200', x: 0, y: 175, rotate: 63, delay: 0.56 },
  { id: 16, className: 'bg-rose-300 dark:bg-rose-200', x: 85, y: 145, rotate: -16, delay: 0.6 },
  { id: 17, className: 'bg-amber-300 dark:bg-amber-200', x: 155, y: 125, rotate: 40, delay: 0.64 },
  { id: 18, className: 'bg-green-300 dark:bg-green-200', x: 215, y: 150, rotate: -70, delay: 0.68 },
]

function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [celebrationStage, setCelebrationStage] = useState<CelebrationStage>('idle')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      console.log('Form submission response:', response)
      if (!response.ok) {
        setCelebrationStage('shake')
        setFormData({ name: '', email: '', message: '' })
        window.setTimeout(() => setCelebrationStage('shrink'), 180)
        window.setTimeout(() => setCelebrationStage('burst'), 420)
        window.setTimeout(() => setCelebrationStage('success'), 760)
        setTimeout(() => {
          setCelebrationStage('idle')
        }, 5000)
      } else {
        console.error('Contact submission failed with status:', response.status)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cardVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      borderRadius: '1rem',
    },
    shake: {
      x: [0, -8, 8, -6, 6, -3, 3, 0],
      rotate: [0, -1.5, 1.5, -1, 1, -0.5, 0.5, 0],
      scale: 1,
      borderRadius: '1rem',
      transition: {
        duration: 0.35,
      },
    },
    shrink: {
      scale: 0.18,
      rotate: -8,
      borderRadius: '9999px',
      transition: {
        duration: 0.35,
        ease: 'easeInOut' as const,
      },
    },
    burst: {
      scale: [0.18, 1.08, 1],
      rotate: [0, 4, 0],
      borderRadius: ['9999px', '1.5rem', '1rem'],
      transition: {
        duration: 0.55,
        ease: 'easeOut' as const,
      },
    },
    success: {
      scale: 1,
      rotate: 0,
      borderRadius: '1rem',
      transition: {
        duration: 0.25,
      },
    },
  } as const satisfies import('framer-motion').Variants

  return (
    <div className='flex justify-center items-center py-16 px-4 gap-8'>
      <aside className="hidden lg:flex lg:min-h-160 flex-col justify-between rounded-3xl bg-background border border-border p-8 shadow-sm">
        <div className="flex flex-col gap-8">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Feedback center
            </span>
            <h3 className="text-3xl font-bold tracking-tight text-foreground">
              Report bugs, share ideas, or ask for help.
            </h3>
            <p className="text-base leading-7 text-muted-foreground">
              If something feels off, tell us. If you have a suggestion, send it.
              We built this space for quick bug reports, improvement requests, and
              anything that helps the website feel better.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Report a bug',
                text: 'Tell us what broke, what you expected, and where it happened.',
              },
              {
                title: 'Suggest an improvement',
                text: 'Share a feature, layout tweak, or workflow idea you want added.',
              },
              {
                title: 'Ask a question',
                text: 'Need help using the app or understanding a part of the UI?',
              },
              {
                title: 'Fast response',
                text: 'We use every report to make the site clearer and more useful.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  What to send
                </p>
                <p className="mt-2 text-sm text-foreground">
                  Screenshots, steps to reproduce, and a short note about the issue.
                </p>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                Quick note
              </div>
            </div>
          </div>
        </div>
      </aside>
      <motion.div
        className="relative min-w-0 origin-center overflow-visible"
        animate={celebrationStage}
        variants={cardVariants}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Have a question? We'd love to hear from you. Send us a message!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {celebrationStage === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-center"
              >
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✓ Message sent successfully!
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  We'll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    disabled={isSubmitting || celebrationStage !== 'idle'}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    disabled={isSubmitting || celebrationStage !== 'idle'}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-2.5 py-1 rounded-lg border border-input bg-transparent text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 resize-none"
                    aria-invalid={!!errors.message}
                    disabled={isSubmitting || celebrationStage !== 'idle'}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || celebrationStage !== 'idle'}
                  className="w-full"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        <AnimatePresence>
          {celebrationStage !== 'idle' && (
            <div className="pointer-events-none absolute inset-0 overflow-visible">
              {confettiPieces.map((piece) => (
                <motion.span
                  key={piece.id}
                  className={`absolute left-1/2 top-1/2 h-3 w-2 rounded-xs ${piece.className}`}
                  initial={{ opacity: 0, scale: 0.2, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.2, 1.2, 0.95, 0.7],
                    x: piece.x,
                    y: piece.y,
                    rotate: piece.rotate,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 1.1,
                    delay: piece.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}

              <motion.div
                className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-2xl dark:bg-white/20"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0, 0.95, 0], scale: [0.2, 1.8, 2.2] }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Contact