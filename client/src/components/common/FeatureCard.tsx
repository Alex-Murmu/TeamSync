export const FeatureCard = ({ title }: { title: string }) => {
  return (
    <div className="w-[220px] h-[260px] bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between transition-all duration-300">
      
      <span className="text-xs bg-gray-100 px-3 py-1 rounded-full w-fit">
        AI-POWERED
      </span>

      <div className="flex justify-center items-center">
        <div className="w-14 h-14 bg-gray-100 rounded-xl" />
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500">
          Some description here
        </p>
      </div>

    </div>
  )
}