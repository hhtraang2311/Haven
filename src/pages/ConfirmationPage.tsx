import { useNavigate } from 'react-router-dom'
import HavenLogo from '../components/HavenLogo'
import type { ConsentState, SurveyState } from '../types'

type ConfirmationPageProps = {
  survey: SurveyState
  consent: ConsentState
  onSubmit: () => void
}

function scoreColorClass(score: number, max: number): string {
  const pct = score / max
  if (pct <= 0.2) return 'bg-[#b7e4c7] text-[#14532d]'
  if (pct <= 0.4) return 'bg-[#95d5b2] text-[#14532d]'
  if (pct <= 0.6) return 'bg-[#52b788] text-white'
  if (pct <= 0.8) return 'bg-[#2d6a4f] text-white'
  return 'bg-[#1b4332] text-white'
}

export default function ConfirmationPage({ survey, consent, onSubmit }: ConfirmationPageProps) {
  const navigate = useNavigate()

  const aspects = [
    { label: 'Sleep Quality', score: survey.q1_sleep + survey.q2_sleep },
    { label: 'Workload', score: survey.q3_workload + survey.q4_workload },
    { label: 'Relationships', score: survey.q5_relationships + survey.q6_relationships },
    { label: 'Motivation', score: survey.q7_motivation + survey.q8_motivation },
  ]

  return (
    <div className="app-page-bg app-page-content flex min-h-[640px] flex-col px-5 py-8">
      <HavenLogo className="mb-2" />
      <h1 className="mt-10 text-center text-2xl font-bold text-haven-900">Confirm Submission</h1>
      <div className="my-auto space-y-3">
        <div className="space-y-3 rounded-xl border border-haven-200 bg-white/90 p-4">
          {aspects.map((aspect) => (
            <div key={aspect.label} className="flex items-center justify-between">
              <span className="text-sm font-semibold text-haven-800">{aspect.label}</span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${scoreColorClass(aspect.score, 10)}`}>
                {aspect.score}/10
              </span>
            </div>
          ))}
        </div>
        {!consent.consentGiven && <p className="text-xs text-red-600">Consent is required. Please return to check-in and complete consent step.</p>}
        <div className="flex gap-2">
          <button onClick={() => navigate('/checkin')} className="btn-3d-outline w-1/2">Back</button>
          <button onClick={onSubmit} disabled={!consent.consentGiven} className="btn-3d w-1/2">Submit</button>
        </div>
      </div>
    </div>
  )
}