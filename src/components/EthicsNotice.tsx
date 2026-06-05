type EthicsNoticeProps = {
  title?: string
  message: string
  linkText?: string
  onLinkClick?: () => void
}

export default function EthicsNotice({ title = 'Privacy & Ethics Notice', message, linkText, onLinkClick }: EthicsNoticeProps) {
  return (
    <div className="rounded-xl border border-haven-200 bg-haven-50 p-3">
      <div className="mb-1 text-sm font-semibold text-haven-800">{title}</div>
      <p className="text-xs leading-relaxed text-haven-700">{message}</p>
      {linkText && (
        <button type="button" onClick={onLinkClick} className="mt-2 text-xs font-medium text-haven-800 underline underline-offset-2">
          {linkText}
        </button>
      )}
    </div>
  )
}