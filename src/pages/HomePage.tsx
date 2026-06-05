import { useNavigate } from 'react-router-dom'
import HavenLogo from '../components/HavenLogo'
import { getCurrentEmployee } from '../utils/auth'

type HomePageProps = {
  auth: { name: string }
  onLogout: () => void
}

export default function HomePage({ auth, onLogout }: HomePageProps) {
  const navigate = useNavigate()
  const employee = getCurrentEmployee()
  const displayName = employee ? employee.firstName : (auth.name || 'Tracy')
  return (
    <div className="app-page-bg app-page-content flex min-h-[640px] flex-col px-5 py-8">
      <HavenLogo className="mb-2" />
      <div className="my-auto space-y-4">
      <h1 className="text-center text-2xl font-bold text-haven-900">Welcome, {displayName}!</h1>
      <button onClick={() => navigate('/survey-intro')} className="w-full rounded-xl border border-haven-200 bg-white/85 p-4 text-left">
        <p className="font-semibold text-haven-800">Weekly Survey</p>
        <p className="text-sm text-haven-700">Complete your weekly wellbeing check-in.</p>
      </button>
      <button onClick={() => navigate('/chat')} className="w-full rounded-xl border border-haven-200 bg-white/85 p-4 text-left">
        <p className="font-semibold text-haven-800">AI Agent</p>
        <p className="text-sm text-haven-700">Talk to Haven AI Agent for support tips.</p>
      </button>
      </div>
      <button onClick={onLogout} className="btn-3d-outline mt-auto mx-auto w-auto px-6 py-1.5 text-xs">
        Log Out
      </button>
    </div>
  )
}