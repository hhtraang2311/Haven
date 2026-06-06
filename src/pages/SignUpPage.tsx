import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HavenLogo from '../components/HavenLogo'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Card 1 — Company Info
  const [company, setCompany] = useState('')
  const [department, setDepartment] = useState('')

  // Card 2 — Personal Info
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    employeeId: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  const isEmployeeIdValid = /^\d{8}$/.test(employeeId)
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordValid = password.length >= 4
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const errors = {
    firstName: touched.firstName && !firstName.trim() ? 'First name is required.' : '',
    lastName: touched.lastName && !lastName.trim() ? 'Last name is required.' : '',
    employeeId: touched.employeeId && !isEmployeeIdValid ? 'Employee ID must be exactly 8 digits.' : '',
    email: touched.email && !isEmailValid ? 'Please enter a valid email address.' : '',
    password: touched.password && !passwordValid ? 'Password must be at least 4 characters.' : '',
    confirmPassword: touched.confirmPassword && !passwordsMatch ? 'Passwords do not match.' : '',
  }

  const isStep1Valid = company.trim() && department.trim()
  const isStep2Valid = useMemo(
    () => firstName.trim() && lastName.trim() && isEmployeeIdValid && isEmailValid && passwordValid && passwordsMatch,
    [firstName, lastName, isEmployeeIdValid, isEmailValid, passwordValid, passwordsMatch],
  )

  const handleNext = () => {
    if (isStep1Valid) setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ firstName: true, lastName: true, employeeId: true, email: true, password: true, confirmPassword: true })
    if (!isStep2Valid) return

    setSubmitting(true)
    setErrorMsg('')

    try {
      const resp = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          department,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          employee_id: employeeId,
          email: email.trim(),
          password,
        }),
      })

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}))
        setErrorMsg(data.detail || 'Signup failed. Please try again.')
        return
      }

      // Signup succeeded — redirect to login
      navigate('/login')
    } catch {
      setErrorMsg('Unable to connect to the server. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-xl border border-haven-200 bg-white/80 px-3 py-2'

  return (
    <form onSubmit={handleSubmit} className="app-page-bg app-page-content flex min-h-[640px] flex-col px-5 py-8">
      <div>
        <HavenLogo />
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 mb-2">
        <div className={`h-2 w-8 rounded-full transition-colors ${step === 1 ? 'bg-haven-600' : 'bg-haven-300'}`} />
        <div className={`h-2 w-8 rounded-full transition-colors ${step === 2 ? 'bg-haven-600' : 'bg-haven-300'}`} />
      </div>

      {/* Card 1 — Company Info */}
      {step === 1 && (
        <div className="my-auto space-y-3">
          <h1 className="text-center text-2xl font-bold text-haven-900 mt-1">Company Information</h1>
          <div>
            <label className="mb-1 block text-sm font-medium text-haven-800">Company</label>
            <select value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass}>
              <option value="">Select company...</option>
              <option value="Samsung">Samsung</option>
              <option value="Apple">Apple</option>
              <option value="Microsoft">Microsoft</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-haven-800">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClass}>
              <option value="">Select department...</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </div>
      )}

      {/* Card 2 — Personal Info */}
      {step === 2 && (
        <div className="my-auto space-y-3">
          <h1 className="text-center text-2xl font-bold text-haven-900 mt-1">Personal Information</h1>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-haven-800">First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, firstName: true }))} className={inputClass} />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-haven-800">Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, lastName: true }))} className={inputClass} />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-haven-800">Employee ID</label>
            <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, '').slice(0, 8))} onBlur={() => setTouched((p) => ({ ...p, employeeId: true }))} maxLength={8} className={inputClass} placeholder="8-digit ID" />
            {errors.employeeId && <p className="mt-1 text-xs text-red-600">{errors.employeeId}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-haven-800">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, email: true }))} className={inputClass} placeholder="name@company.com" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-haven-800">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, password: true }))} className={inputClass} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-haven-800">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))} className={inputClass} />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Server error message */}
          {errorMsg && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3 mt-4">
        {step === 1 ? (
          <>
            <button type="button" onClick={handleNext} disabled={!isStep1Valid} className="btn-3d w-full">Next</button>
            <button type="button" onClick={() => navigate('/login')} className="block w-full text-center text-sm text-haven-800 underline underline-offset-2">
              Already have an account? Log in
            </button>
          </>
        ) : (
          <>
            {/* General error for step 2 */}
            {errorMsg && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="btn-3d-outline py-1 px-4 text-xs">Back</button>
              <button type="submit" disabled={!isStep2Valid || submitting} className="btn-3d flex-1 py-1 px-4 text-xs">
                {submitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  )
}