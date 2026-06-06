import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="app-page-bg app-page-content flex min-h-[640px] flex-col px-5 pt-5 pb-8">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/login')} className="flex items-center justify-center h-8 w-8 rounded-full border border-haven-300 bg-white/70 text-haven-700 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="haven-logo-text text-2xl font-bold">Privacy Policy</span>
        <div className="w-8" />
      </div>
      <div className="mt-6 space-y-5 overflow-y-auto pr-1 pb-2">
        <section>
          <h2 className="text-sm font-bold text-haven-800 mb-1">What We Collect</h2>
          <p className="text-xs leading-relaxed text-haven-700">
            Your survey answers only. No name, location, or device data.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-bold text-haven-800 mb-1">How It's Used</h2>
          <p className="text-xs leading-relaxed text-haven-700">
            Aggregated team trends only. Managers cannot see individual responses.
            Reports are only generated for groups of 5 or more people.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-bold text-haven-800 mb-1">Your Rights</h2>
          <p className="text-xs leading-relaxed text-haven-700">
            Participation is encouraged — your responses help the company understand
            and improve the work environment. You can skip any question, withdraw
            consent, and delete your data anytime.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-bold text-haven-800 mb-1">Security</h2>
          <p className="text-xs leading-relaxed text-haven-700">
            All data is encrypted. Access is restricted to authorized personnel only.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-bold text-haven-800 mb-1">Account Termination</h2>
          <p className="text-xs leading-relaxed text-haven-700">
            When an employee leaves the company, the company is responsible for deleting their Haven account. All associated data will be permanently removed upon account deletion.
          </p>
        </section>
      </div>
    </div>
  )
}