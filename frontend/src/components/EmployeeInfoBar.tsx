import type { AuthState } from '../types'
import { getCurrentEmployee } from '../utils/auth'

type EmployeeInfoBarProps = {
  auth: AuthState
}

export default function EmployeeInfoBar({ auth }: EmployeeInfoBarProps) {
  const employee = getCurrentEmployee()
  const fullName = employee ? `${employee.firstName} ${employee.lastName}`.trim() : auth.name
  const displayId = employee?.employeeId || auth.employeeId

  if (!fullName.trim()) return null

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <div className="flex items-center justify-between bg-emerald-50 px-6 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-800">{fullName}</p>
        {displayId.trim() && <p className="text-xs text-slate-600">ID: {displayId}</p>}
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-700">
        {initials || 'EM'}
      </div>
    </div>
  )
}