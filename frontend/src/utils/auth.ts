export type EmployeeInfo = {
  firstName: string
  lastName: string
  email: string
  employeeId: string
  company: string
  department: string
  accessToken: string
  refreshToken: string
}

/**
 * Returns the currently logged-in employee's info.
 * Reads from localStorage — set at login time.
 */
export function getCurrentEmployee(): EmployeeInfo | null {
  try {
    const raw = localStorage.getItem('havenEmployee')
    if (!raw) return null
    return JSON.parse(raw) as EmployeeInfo
  } catch {
    return null
  }
}

/** Persist employee info after login. */
export function saveEmployee(info: EmployeeInfo): void {
  localStorage.setItem('havenEmployee', JSON.stringify(info))
}

/** Clear employee info on logout. */
export function clearEmployee(): void {
  localStorage.removeItem('havenEmployee')
}