import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import EmployeeInfoBar from './components/EmployeeInfoBar'
import AIChatPage from './pages/AIChatPage'
import CheckInPage from './pages/CheckInPage'
import ConfirmationPage from './pages/ConfirmationPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import SignUpPage from './pages/SignUpPage'
import SuccessPage from './pages/SuccessPage'
import SurveyIntroPage from './pages/SurveyIntroPage'
import WelcomePage from './pages/WelcomePage'
import type { AuthState, ConsentState, SurveyState } from './types'
import { clearEmployee, getCurrentEmployee } from './utils/auth'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const initialAuth: AuthState = { employeeId: '', name: '' }

/** Build initial auth state from localStorage (survives page refresh). */
function getInitialAuth(): AuthState {
  const emp = getCurrentEmployee()
  if (emp && emp.employeeId && emp.firstName) {
    return { employeeId: emp.employeeId, name: emp.firstName }
  }
  return initialAuth
}
const initialSurvey: SurveyState = {
  q1_sleep: 0,
  q2_sleep: 0,
  q3_workload: 0,
  q4_workload: 0,
  q5_relationships: 0,
  q6_relationships: 0,
  q7_motivation: 0,
  q8_motivation: 0,
}
const initialConsent: ConsentState = { consentGiven: false }

function AppShell({ children, auth }: { children: ReactNode; auth: AuthState }) {
  const location = useLocation()
  const showOnPaths = ['/home', '/survey-intro', '/checkin', '/chat', '/confirm', '/success']
  const showUserMeta = auth.employeeId.trim() && auth.name.trim()
  const showEmployeeBar = showUserMeta && showOnPaths.includes(location.pathname)

  return (
    <main className="app-page-bg min-h-screen">
      <div className="mx-auto w-full max-w-[390px] py-6 px-3 flex min-h-screen items-center justify-center">
        <section className="app-card relative flex w-full flex-col overflow-hidden">
          <div className="flex flex-1 flex-col pb-0 pt-4">
            <div className="flex-1 px-5">
              {children}
            </div>
            {showEmployeeBar && (
              <div className="mt-auto">
                <EmployeeInfoBar auth={auth} />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function AppRoutes() {
  const navigate = useNavigate()

  const [auth, setAuth] = useState<AuthState>(getInitialAuth)
  const [survey, setSurvey] = useState<SurveyState>(initialSurvey)
  const [consent, setConsent] = useState<ConsentState>(initialConsent)

  const isLoggedIn = useMemo(() => auth.employeeId.trim() && auth.name.trim(), [auth.employeeId, auth.name])

  const handleSubmit = async () => {
    if (!consent.consentGiven) return

    const emp = getCurrentEmployee()
    if (!emp?.accessToken) {
      navigate('/login')
      return
    }

    try {
      const resp = await fetch(`${API_BASE}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${emp.accessToken}`,
        },
        body: JSON.stringify({
          employee_id: emp.employeeId,
          q1: survey.q1_sleep,
          q2: survey.q2_sleep,
          q3: survey.q3_workload,
          q4: survey.q4_workload,
          q5: survey.q5_relationships,
          q6: survey.q6_relationships,
          q7: survey.q7_motivation,
          q8: survey.q8_motivation,
        }),
      })

      if (resp.status === 401) {
        clearEmployee()
        navigate('/login')
        return
      }

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}))
        alert(data.detail || 'Failed to submit check-in. Please try again.')
        return
      }
    } catch {
      alert('Unable to connect to the server. Please try again later.')
      return
    }

    navigate('/success', { state: { submitted: true, submittedAt: new Date().toISOString() } })
  }

  const handleLogout = () => {
    setAuth(initialAuth)
    setSurvey(initialSurvey)
    setConsent(initialConsent)
    clearEmployee()
    navigate('/')
  }

  return (
    <AppShell auth={auth}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage auth={auth} onComplete={setAuth} />} />
        <Route path="/home" element={isLoggedIn ? <HomePage auth={auth} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/survey-intro" element={isLoggedIn ? <SurveyIntroPage /> : <Navigate to="/login" replace />} />
        <Route path="/checkin" element={isLoggedIn ? <CheckInPage survey={survey} consent={consent} onSurveyChange={setSurvey} onConsentChange={setConsent} /> : <Navigate to="/login" replace />} />
        <Route path="/chat" element={isLoggedIn ? <AIChatPage /> : <Navigate to="/login" replace />} />
        <Route path="/confirm" element={isLoggedIn ? <ConfirmationPage survey={survey} consent={consent} onSubmit={handleSubmit} /> : <Navigate to="/login" replace />} />
        <Route path="/success" element={isLoggedIn ? <SuccessPage /> : <Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default AppRoutes