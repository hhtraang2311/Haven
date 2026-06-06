import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConsentStep from '../components/ConsentStep'
import EthicsNotice from '../components/EthicsNotice'
import HavenLogo from '../components/HavenLogo'
import ProgressBar from '../components/ProgressBar'
import type { ConsentState, SurveyState } from '../types'

type CheckInPageProps = {
  survey: SurveyState
  consent: ConsentState
  onSurveyChange: (data: SurveyState) => void
  onConsentChange: (data: ConsentState) => void
}

const ratingLabels = ['Very bad', 'Bad', 'Neutral', 'Good', 'Very good']

function RatingButtons({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="rating-group">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`rating-btn rating-${n} ${value === n ? 'selected' : ''}`}
        >
          {n}
          <span className="rating-label">{ratingLabels[n - 1]}</span>
        </button>
      ))}
    </div>
  )
}

export default function CheckInPage({ survey, consent, onSurveyChange, onConsentChange }: CheckInPageProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const stepValid = useMemo(() => {
    if (step === 1) return survey.q1_sleep > 0 && survey.q2_sleep > 0
    if (step === 2) return survey.q3_workload > 0 && survey.q4_workload > 0
    if (step === 3) return survey.q5_relationships > 0 && survey.q6_relationships > 0
    if (step === 4) return survey.q7_motivation > 0 && survey.q8_motivation > 0
    return consent.consentGiven
  }, [step, survey, consent.consentGiven])

  return (
    <div className="app-page-bg app-page-content flex min-h-[640px] flex-col px-5 pt-8 pb-6">
      <HavenLogo className="text-4xl md:text-5xl" />
      <h1 className="mt-8 text-center text-2xl font-bold text-haven-900">Weekly Check-in</h1>
      <div className="my-auto space-y-4">
      <ProgressBar currentStep={step} totalSteps={5} />

      {step === 1 && (
        <div className="space-y-5">
          <p className="text-center"><span className="inline-block rounded-full bg-haven-100 border border-haven-300 px-4 py-1 text-sm font-bold text-haven-700 uppercase tracking-wider">Sleep</span></p>
          <div className="space-y-3 mt-2">
            <p className="text-lg font-bold text-haven-900">1. Did you sleep well and wake up feeling refreshed this week?</p>
            <RatingButtons value={survey.q1_sleep} onChange={(v) => onSurveyChange({ ...survey, q1_sleep: v })} />
          </div>
          <div className="space-y-3 mt-2">
            <p className="text-lg font-bold text-haven-900">2. Did work-related worries disrupt your sleep this week?</p>
            <RatingButtons value={survey.q2_sleep} onChange={(v) => onSurveyChange({ ...survey, q2_sleep: v })} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <p className="text-center"><span className="inline-block rounded-full bg-haven-100 border border-haven-300 px-4 py-1 text-sm font-bold text-haven-700 uppercase tracking-wider">Workload</span></p>
          <div className="space-y-3 mt-2">
            <p className="text-lg font-bold text-haven-900">3. Is your current workload manageable?</p>
            <RatingButtons value={survey.q3_workload} onChange={(v) => onSurveyChange({ ...survey, q3_workload: v })} />
          </div>
          <div className="space-y-3 mt-2">
            <p className="text-lg font-bold text-haven-900">4. Can you fully switch off after work?</p>
            <RatingButtons value={survey.q4_workload} onChange={(v) => onSurveyChange({ ...survey, q4_workload: v })} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <p className="text-center"><span className="inline-block rounded-full bg-haven-100 border border-haven-300 px-4 py-1 text-sm font-bold text-haven-700 uppercase tracking-wider">Relationships</span></p>
          <div className="space-y-3 mt-2">
            <p className="text-lg font-bold text-haven-900">5. Do you feel supported and well-connected with your colleagues and manager?</p>
            <RatingButtons value={survey.q5_relationships} onChange={(v) => onSurveyChange({ ...survey, q5_relationships: v })} />
          </div>
          <div className="space-y-3 mt-2">
            <p className="text-lg font-bold text-haven-900">6. Has work negatively affected your personal life?</p>
            <RatingButtons value={survey.q6_relationships} onChange={(v) => onSurveyChange({ ...survey, q6_relationships: v })} />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <p className="text-center"><span className="inline-block rounded-full bg-haven-100 border border-haven-300 px-4 py-1 text-sm font-bold text-haven-700 uppercase tracking-wider">Motivation</span></p>
          <div className="space-y-3 mt-2">
            <p className="text-lg font-bold text-haven-900">7. Does your current role feel meaningful?</p>
            <RatingButtons value={survey.q7_motivation} onChange={(v) => onSurveyChange({ ...survey, q7_motivation: v })} />
          </div>
          <div className="space-y-3 mt-2">
            <p className="text-lg font-bold text-haven-900">8. Do you feel motivated to go to work each morning?</p>
            <RatingButtons value={survey.q8_motivation} onChange={(v) => onSurveyChange({ ...survey, q8_motivation: v })} />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3">
          <EthicsNotice message="Your check-in is stored anonymously and used for team-level trends only." />
          <ConsentStep
            checked={consent.consentGiven}
            touched={!consent.consentGiven}
            onToggle={(checked) => onConsentChange({ consentGiven: checked })}
            onBlur={() => undefined}
          />
        </div>
      )}
      </div>
      <div className="mt-auto pt-4 pb-2 flex gap-2">
        <button type="button" onClick={() => (step === 1 ? navigate('/home') : setStep(step - 1))} className="btn-3d-outline w-1/2 py-1.5 text-xs">Back</button>
        <button type="button" onClick={() => { if (!stepValid) return; if (step < 5) setStep(step + 1); else navigate('/confirm') }} disabled={!stepValid} className="btn-3d w-1/2 py-1.5 text-xs">{step === 5 ? 'Review' : 'Next'}</button>
      </div>
    </div>
  )
}