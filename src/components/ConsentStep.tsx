type ConsentStepProps = {
  checked: boolean
  touched: boolean
  onToggle: (checked: boolean) => void
  onBlur: () => void
}

export default function ConsentStep({ checked, touched, onToggle, onBlur }: ConsentStepProps) {
  const showError = touched && !checked

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-haven-200 bg-white p-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          onBlur={onBlur}
          className="mt-1 h-4 w-4 accent-haven-600"
        />
        <span className="text-sm text-haven-800">
          I agree to the Privacy Policy and Terms of Service of Haven
        </span>
      </label>
      {showError && <p className="text-xs text-red-600">You must provide consent to continue.</p>}
    </div>
  )
}
