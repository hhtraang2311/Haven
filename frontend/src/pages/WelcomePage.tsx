import { useNavigate } from 'react-router-dom'
import HavenLogo from '../components/HavenLogo'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="app-page-bg app-page-content flex min-h-[640px] flex-col justify-between px-5 py-8 text-center">
      <div />
      <div className="flex flex-col items-center justify-center">
        <HavenLogo className="text-5xl md:text-6xl" />
        <p className="mt-6 text-3xl font-bold text-slate-800">Welcome to Haven!</p>
        <p className="mt-3 text-xl font-semibold text-slate-700">Your Feelings Matter</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate('/login')} className="btn-3d flex-1">
          Log In
        </button>
        <button onClick={() => navigate('/signup')} className="btn-3d flex-1">
          Sign Up
        </button>
      </div>
    </div>
  )
}
