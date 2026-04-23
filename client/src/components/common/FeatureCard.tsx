import { useRef } from "react"

export const FeatureCard = () => {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const midX = rect.width / 2
    const midY = rect.height / 2

    const rotateX = ((y - midY) / midY) * 10
    const rotateY = ((x - midX) / midX) * 10

    card.style.transform = `
      rotateX(${-rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale(1.05)
    `
  }

  const reset = () => {
    if (ref.current) {
      ref.current.style.transform =
        "rotateX(0deg) rotateY(0deg) scale(1)"
    }
  }

  return (
    <div className="perspective">
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={reset}
        className="w-[220px] h-[260px] bg-white rounded-2xl shadow-xl p-6 transition-transform duration-200"
      >
        <h3 className="text-center font-semibold">Card</h3>
      </div>
    </div>
  )
}