type ProgressBarProps = {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100))

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-haven-700">
        <span>Progress</span>
        <span>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-haven-100">
        <div
          className="h-full rounded-full bg-haven-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
