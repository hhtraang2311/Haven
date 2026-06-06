import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EthicsNotice from '../components/EthicsNotice'
import HavenLogo from '../components/HavenLogo'
import type { AuthState } from '../types'
import { saveEmployee } from '../utils/auth'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

type LoginPageProps = {
  auth: AuthState
  onComplete: (data: AuthState) => void
}

export default function LoginPage({ auth, onComplete }: LoginPageProps) {
  const navigate = useNavigate()
  const [touched, setTouched] = useState({ email: false, password: false })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const emailError = touched.email && !isEmailValid ? 'Please enter a valid email address.' : ''
  const passwordError = touched.password && password.length < 4 ? 'Password must be at least 4 characters.' : ''

  const isValid = useMemo(() => isEmailValid && password.length >= 4, [isEmailValid, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!isValid) return

    setSubmitting(true)
    setErrorMsg('')

    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}))
        setErrorMsg(data.detail || 'Login failed. Please check your credentials.')
        return
      }

      const data = await resp.json()

      // Save to localStorage so getCurrentEmployee() works everywhere
      saveEmployee({
        firstName: data.first_name,
        lastName: '',
        email: data.email,
        employeeId: data.employee_id,
        company: '',
        department: '',
        accessToken: data.access_token,
      })

      // Update React state
      onComplete({
        ...auth,
        employeeId: data.employee_id,
        name: data.first_name,
      })

      navigate('/home')
    } catch {
      setErrorMsg('Unable to connect to the server. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="app-page-bg app-page-content flex min-h-[640px] flex-col px-5 py-8">
      <div>
        <HavenLogo />
      </div>
      <div className="my-auto space-y-4">
        <h1 className="text-center text-2xl font-bold text-haven-900 mt-1">Login to your account</h1>
        <div>
          <label className="mb-1 block text-sm font-medium text-haven-800">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, email: true }))} className="w-full rounded-xl border border-haven-200 bg-white/80 px-3 py-2" placeholder="name@company.com" />
          {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-haven-800">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, password: true }))} className="w-full rounded-xl border border-haven-200 bg-white/80 px-3 py-2" />
          {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
        </div>
        {/* Server error message */}
        {errorMsg && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}
        <button type="button" className="block w-full text-center text-sm text-haven-800 underline underline-offset-2">
          Forgotten your password?
        </button>
        <button type="button" onClick={() => navigate('/signup')} className="block w-full text-center text-sm text-haven-800 underline underline-offset-2">
          Don't have an account? Sign up
        </button>
      </div>
      <div className="space-y-4">
        <EthicsNotice
          message="Haven collects only what's needed. Your responses are anonymous and never tied to your identity."
          linkText="Privacy Policy and Terms of Use"
          onLinkClick={() => navigate('/privacy-policy')}
        />
        <button type="submit" disabled={!isValid || submitting} className="btn-3d w-full">
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  )
}