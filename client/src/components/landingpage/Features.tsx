import { FeatureCard } from '../common/FeatureCard'
export const Features = () => {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      
      <p className="text-sm text-white/70 mb-2">
        fin-tastic features. zero-hassle.
      </p>

      <h1 className="text-4xl md:text-6xl font-bold text-white text-center max-w-4xl">
        BECAUSE CODING SHOULDN'T RUIN YOUR SLEEP SCHEDULE
      </h1>

      <div className="flex gap-6 mt-16 flex-wrap justify-center">
        <FeatureCard title="Smart Contracts" />
        <FeatureCard title="Deploy" />
        <FeatureCard title="Winterfell" />
        <FeatureCard title="Framework" />
        <FeatureCard title="Security" />
      </div>

    </div>
  )
}