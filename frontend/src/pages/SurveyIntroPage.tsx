import { useNavigate } from 'react-router-dom'
import HavenLogo from '../components/HavenLogo'

export default function SurveyIntroPage() {
  const navigate = useNavigate()

  return (
    <div className="app-page-bg app-page-content flex min-h-[640px] flex-col px-5 py-8">
      <HavenLogo className="mb-2" />
      <h1 className="mt-4 text-center text-2xl font-bold text-haven-900">Before you begin</h1>
      <div className="my-auto space-y-4 text-sm text-haven-800 leading-relaxed">
        <p>
          This check-in covers <strong>4 topics</strong>, with <strong>2 questions each</strong> (8 questions total):
        </p>
        <div className="grid grid-cols-2 gap-2">
          {['Sleep', 'Workload', 'Relationships', 'Motivation'].map((topic) => (
            <div key={topic} className="rounded-lg border border-haven-200 bg-white/80 px-3 py-2 text-center font-semibold text-haven-700">
              {topic}
            </div>
          ))}
        </div>
        <p>
          Your responses will be used by the company to build a <strong>burnout risk prediction model</strong> for the HR team, who will receive an automated monthly dashboard and report with aggregated insights about employee wellbeing.
        </p>
        <p>
          All personal information is <strong>encrypted and anonymised</strong> before being stored or used.
        </p>
      </div>
      <button onClick={() => navigate('/checkin')} className="btn-3d mt-auto w-full">
        Start Check-in
      </button>
    </div>
  )
}