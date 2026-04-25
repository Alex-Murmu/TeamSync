'use client'

import React, { useMemo, useState } from 'react'
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

type Particle = {
  id: number
  className: string
  startX: number
  startY: number
  driftX: number
  driftY: number
  duration: number
  delay: number
}

const floatParticles: Particle[] = [
  { id: 1, className: 'bg-sky-400/70 dark:bg-sky-300/70', startX: 8, startY: 10, driftX: 12, driftY: -10, duration: 6.4, delay: 0 },
  { id: 2, className: 'bg-fuchsia-400/70 dark:bg-fuchsia-300/70', startX: 16, startY: 24, driftX: -10, driftY: 12, duration: 5.9, delay: 0.15 },
  { id: 3, className: 'bg-amber-300/70 dark:bg-amber-200/70', startX: 24, startY: 15, driftX: 10, driftY: 8, duration: 6.8, delay: 0.28 },
  { id: 4, className: 'bg-emerald-400/70 dark:bg-emerald-300/70', startX: 32, startY: 38, driftX: -12, driftY: -8, duration: 7.2, delay: 0.1 },
  { id: 5, className: 'bg-rose-400/70 dark:bg-rose-300/70', startX: 42, startY: 18, driftX: 8, driftY: 14, duration: 6.1, delay: 0.36 },
  { id: 6, className: 'bg-indigo-400/70 dark:bg-indigo-300/70', startX: 50, startY: 30, driftX: -8, driftY: 10, duration: 6.5, delay: 0.2 },
  { id: 7, className: 'bg-cyan-400/70 dark:bg-cyan-300/70', startX: 58, startY: 12, driftX: 14, driftY: -12, duration: 7, delay: 0.42 },
  { id: 8, className: 'bg-white/75 dark:bg-white/60', startX: 66, startY: 26, driftX: -6, driftY: 8, duration: 5.8, delay: 0.12 },
  { id: 9, className: 'bg-sky-300/70 dark:bg-sky-200/70', startX: 74, startY: 16, driftX: 9, driftY: 9, duration: 6.9, delay: 0.3 },
  { id: 10, className: 'bg-amber-400/70 dark:bg-amber-300/70', startX: 82, startY: 34, driftX: -11, driftY: -9, duration: 6.2, delay: 0.18 },
  { id: 11, className: 'bg-fuchsia-300/70 dark:bg-fuchsia-200/70', startX: 90, startY: 20, driftX: 7, driftY: 13, duration: 7.1, delay: 0.44 },
  { id: 12, className: 'bg-emerald-300/70 dark:bg-emerald-200/70', startX: 12, startY: 52, driftX: 10, driftY: -8, duration: 6.7, delay: 0.24 },
  { id: 13, className: 'bg-rose-300/70 dark:bg-rose-200/70', startX: 20, startY: 64, driftX: -9, driftY: 10, duration: 6.3, delay: 0.4 },
  { id: 14, className: 'bg-cyan-300/70 dark:bg-cyan-200/70', startX: 30, startY: 56, driftX: 13, driftY: 6, duration: 5.7, delay: 0.08 },
  { id: 15, className: 'bg-indigo-300/70 dark:bg-indigo-200/70', startX: 40, startY: 72, driftX: -7, driftY: -11, duration: 7.2, delay: 0.32 },
  { id: 16, className: 'bg-white/70 dark:bg-white/55', startX: 50, startY: 62, driftX: 6, driftY: 7, duration: 6.6, delay: 0.16 },
  { id: 17, className: 'bg-sky-300/70 dark:bg-sky-200/70', startX: 60, startY: 54, driftX: -10, driftY: 12, duration: 6.8, delay: 0.5 },
  { id: 18, className: 'bg-fuchsia-300/70 dark:bg-fuchsia-200/70', startX: 70, startY: 68, driftX: 12, driftY: -8, duration: 5.9, delay: 0.22 },
  { id: 19, className: 'bg-amber-300/70 dark:bg-amber-200/70', startX: 80, startY: 58, driftX: -8, driftY: 9, duration: 7, delay: 0.34 },
  { id: 20, className: 'bg-emerald-300/70 dark:bg-emerald-200/70', startX: 88, startY: 70, driftX: 7, driftY: -10, duration: 6.1, delay: 0.46 },
  { id: 21, className: 'bg-slate-900/60 dark:bg-white/45', startX: 6, startY: 44, driftX: 8, driftY: -6, duration: 6.2, delay: 0.12 },
  { id: 22, className: 'bg-slate-900/60 dark:bg-white/45', startX: 13, startY: 82, driftX: -7, driftY: 10, duration: 7.1, delay: 0.38 },
  { id: 23, className: 'bg-slate-900/60 dark:bg-white/45', startX: 22, startY: 48, driftX: 9, driftY: 6, duration: 5.8, delay: 0.25 },
  { id: 24, className: 'bg-slate-900/60 dark:bg-white/45', startX: 34, startY: 86, driftX: -10, driftY: -7, duration: 6.7, delay: 0.48 },
  { id: 25, className: 'bg-slate-900/60 dark:bg-white/45', startX: 46, startY: 44, driftX: 11, driftY: 8, duration: 6.3, delay: 0.14 },
  { id: 26, className: 'bg-slate-900/60 dark:bg-white/45', startX: 57, startY: 80, driftX: -8, driftY: 11, duration: 7.2, delay: 0.3 },
  { id: 27, className: 'bg-slate-900/60 dark:bg-white/45', startX: 68, startY: 50, driftX: 10, driftY: -8, duration: 5.9, delay: 0.2 },
  { id: 28, className: 'bg-slate-900/60 dark:bg-white/45', startX: 79, startY: 88, driftX: -6, driftY: 7, duration: 6.5, delay: 0.42 },
  { id: 29, className: 'bg-slate-900/60 dark:bg-white/45', startX: 88, startY: 46, driftX: 9, driftY: 12, duration: 6.8, delay: 0.16 },
  { id: 30, className: 'bg-slate-900/60 dark:bg-white/45', startX: 94, startY: 78, driftX: -8, driftY: -9, duration: 7, delay: 0.52 },
]

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
  const [isAsideHovered, setIsAsideHovered] = useState(false)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })

  const hoverParticleVariants = useMemo(
    () => ({
      rest: {
        x: 0,
        y: 0,
        opacity: 0.55,
        scale: 1,
      },
      hover: (particle: Particle) => ({
        x: [0, particle.driftX, -particle.driftX * 0.45, particle.driftX * 0.2, 0],
        y: [0, particle.driftY, -particle.driftY * 0.45, particle.driftY * 0.2, 0],
        opacity: [0.55, 1, 0.75, 0.95, 0.55],
        scale: [1, 1.45, 0.9, 1.2, 1],
        transition: {
          duration: particle.duration,
          ease: 'easeInOut' as const,
          repeat: Infinity,
          repeatType: 'mirror' as const,
          delay: particle.delay,
        },
      }),
    }),
    []
  )

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
      <motion.aside
        className="relative hidden overflow-hidden rounded-3xl bg-linear-to-br from-background via-muted/30 to-background p-8 shadow-[0_20px_80px_rgba(15,23,42,0.12)] lg:flex lg:min-h-160 flex-col justify-between"
        whileHover="hover"
        initial="rest"
        animate="rest"
        onHoverStart={() => setIsAsideHovered(true)}
        onHoverEnd={() => {
          setIsAsideHovered(false)
          setPointer({ x: 50, y: 50 })
        }}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect()
          const x = ((event.clientX - bounds.left) / bounds.width) * 100
          const y = ((event.clientY - bounds.top) / bounds.height) * 100

          setPointer({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
          })
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-70"
          variants={{
            rest: { scale: 1, opacity: 0.7 },
            hover: { scale: 1.04, opacity: 0.95 },
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.12),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.05))]" />
        </motion.div>

        <div className="relative z-10 flex flex-col gap-8">
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
              <motion.div
                key={item.title}
                className="rounded-2xl border border-border/70 bg-background/70 p-4 backdrop-blur-sm"
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/70 p-5 backdrop-blur-sm">
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

        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {floatParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className={`absolute h-1 w-1 rounded-full ${particle.className}`}
              style={{
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
                transformOrigin: 'center center',
              }}
              custom={particle}
              variants={hoverParticleVariants}
              animate={isAsideHovered ? 'hover' : 'rest'}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeInOut',
              }}
            />
          ))}

          <motion.div
            className="absolute h-28 w-28 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-[1px]"
            style={{ left: `${pointer.x}%`, top: `${pointer.y}%`, translateX: '-50%', translateY: '-50%' }}
            animate={isAsideHovered ? { scale: [0.88, 1.06, 0.92], opacity: [0.22, 0.35, 0.22] } : { scale: 0.7, opacity: 0.12 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.aside>
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