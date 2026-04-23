import { CheckCircle2, Users, Zap, BarChart3, Lock, MessageSquare } from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  status: "Deployed" | "In Progress" | "Pending"
}

const features: Feature[] = [
  {
    icon: <Zap className="w-6 h-6 text-blue-500" />,
    title: "Lightning Fast",
    description: "Create, assign, and track tasks in seconds. Real-time updates keep everyone in sync.",
    status: "Deployed"
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
    status: "Deployed"
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
    status: "Pending"
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
  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features, Made Simple
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage projects, collaborate with your team, and ship faster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-secondary/10 dark:bg-secondary/20 rounded-lg w-fit group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusStyles(feature.status)}`}>
                  {feature.status}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
