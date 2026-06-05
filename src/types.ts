export type AuthState = {
  employeeId: string
  name: string
}

export type SurveyState = {
  q1_sleep: number
  q2_sleep: number
  q3_workload: number
  q4_workload: number
  q5_relationships: number
  q6_relationships: number
  q7_motivation: number
  q8_motivation: number
}

export type ConsentState = {
  consentGiven: boolean
}

export type SubmissionRouterState = {
  submitted: boolean
  submittedAt: string
}