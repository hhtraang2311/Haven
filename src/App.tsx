import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
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
import { clearEmployee } from './utils/auth'

const initialAuth: AuthState = { employeeId: '', name: '' }
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

  const [auth, setAuth] = useState<AuthState>(initialAuth)
  const [survey, setSurvey] = useState<SurveyState>(initialSurvey)
  const [consent, setConsent] = useState<ConsentState>(initialConsent)

  const isLoggedIn = useMemo(() => auth.employeeId.trim() && auth.name.trim(), [auth.employeeId, auth.name])

  const handleSubmit = () => {
    if (!consent.consentGiven) return
    const payload = { survey, consent, submittedAt: new Date().toISOString() }
    localStorage.setItem('havenSubmission', JSON.stringify(payload))
    navigate('/success', { state: { submitted: true, submittedAt: payload.submittedAt } })
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