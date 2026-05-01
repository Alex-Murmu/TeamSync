import { CheckCircle2, Users, Zap, BarChart3, Lock, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useTypewriter } from "@/hooks/useTypewriter"
import { BentoGrid } from "@/components/ui/bento-grid"
import { useState } from "react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  status: "Deployed" | "In Progress" | "Pending"
  colSpan?: number
  rowSpan?: number
}

const features: Feature[] = [
  {
    icon: <Zap className="w-8 h-8 text-blue-500" />,
    title: "Lightning Fast",
    description: "Create, assign, and track tasks in seconds. Real-time updates keep everyone in sync.",
    status: "Deployed",
    colSpan: 2,
    rowSpan: 1
  },
  {
    icon: <Users className="w-6 h-6 text-purple-500" />,
    title: "Team Collaboration",
    description: "Built-in comments, mentions, and activity feeds to keep your team connected.",
    status: "Deployed"
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-green-500" />,
    title: "Advanced Analytics",
    description: "Get insights into your team's productivity with comprehensive charts and reports.",
    status: "In Progress"
  },
  {
    icon: <Lock className="w-6 h-6 text-red-500" />,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with GDPR, SOC 2, and ISO standards.",
    status: "Deployed",
    colSpan: 1,
    rowSpan: 2
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
    title: "Smart Notifications",
    description: "Stay informed with intelligent notifications that know what matters to you.",
    status: "In Progress"
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-cyan-500" />,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and streamline your entire project lifecycle.",
    status: "Pending",
    colSpan: 2,
    rowSpan: 1
  },
]

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Deployed":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
    case "In Progress":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
    case "Pending":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const { displayText, startTyping, stopTyping } = useTypewriter("", 30)

  const handleMouseEnter = (feature: Feature) => {
    setHoveredCard(feature.title)
    startTyping(feature.description)
  }

  const handleMouseLeave = () => {
    setHoveredCard(null)
    stopTyping()
  }

  const bentoItems = features.map((feature, idx) => ({
    id: `feature-${idx}`,
    colSpan: feature.colSpan,
    rowSpan: feature.rowSpan,
    content: (
      <motion.div
        className="h-full p-6 flex flex-col justify-between cursor-pointer group"
        onMouseEnter={() => handleMouseEnter(feature)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="p-3 bg-secondary/10 dark:bg-secondary/20 rounded-xl w-fit group-hover:bg-primary/10 transition-all duration-300 group-hover:scale-110"
            whileHover={{ rotate: 5 }}
          >
            {feature.icon}
          </motion.div>
          <motion.span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusStyles(feature.status)}`}
            whileHover={{ scale: 1.05 }}
          >
            {feature.status}
          </motion.span>
        </div>

        <div className="flex-1">
          <motion.h3
            className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors"
            whileHover={{ x: 5 }}
          >
            {feature.title}
          </motion.h3>

          <motion.p
            className="text-muted-foreground text-sm leading-relaxed"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {hoveredCard === feature.title ? displayText : feature.description}
          </motion.p>
        </div>

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    ),
  }))

  return (
    <section id="features" className="py-24 px-6 bg-transparent relative overflow-hidden">
      {/* <AnimatedGridBackground opacity={0.4} gridSize={50} animationSpeed={40} /> */}

      {/* Additional floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`feature-${i}`}
            className="absolute w-2 h-2 bg-primary/20 rounded-full blur-sm"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features, Made Simple
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage projects, collaborate with your team, and ship faster
          </p>
        </motion.div>

        <BentoGrid
          items={bentoItems}
          className="max-w-6xl mx-auto"
          gridCols={3}
        />
      </div>
    </section>
  )
}
