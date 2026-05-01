import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface Testimonial {
  name: string
  role: string
  feedback: string
  avatar: string
  initials: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    feedback: "TeamSync completely transformed how our team manages projects. We've cut down our meeting time by 40% and productivity is through the roof!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    initials: "SC",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Team Lead",
    feedback: "The collaboration features are incredible. Our distributed team feels more connected than ever. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    initials: "MJ",
    rating: 5
  },
  {
    name: "Emma Williams",
    role: "Designer",
    feedback: "Finally, a tool that doesn't make design collaboration feel like a chore. TeamSync is intuitive and powerful.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    initials: "EW",
    rating: 5
  },
  {
    name: "David Martinez",
    role: "Development Manager",
    feedback: "Managing sprints and tracking progress has never been easier. Our team's velocity improved significantly.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    initials: "DM",
    rating: 5
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by Teams Everywhere
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what teams are saying about TeamSync
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx}
              className="bg-background dark:bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
   
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                "{testimonial.feedback}"
              </p>

 
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className=" text-white font-semibold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
