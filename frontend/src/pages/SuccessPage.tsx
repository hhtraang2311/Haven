import { useNavigate } from 'react-router-dom'
import HavenLogo from '../components/HavenLogo'

export default function SuccessPage() {
  const navigate = useNavigate()

  const nextCheckIn = new Date()
  nextCheckIn.setDate(nextCheckIn.getDate() + 7)
  const formattedDate = nextCheckIn.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Haven Wellbeing Check-in')}&dates=${nextCheckIn.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${nextCheckIn.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent('Time for your weekly wellbeing check-in with Haven.')}`

  return (
    <div className="app-page-bg app-page-content flex min-h-[640px] flex-col px-5 py-8 text-center">
      <HavenLogo className="text-center text-4xl md:text-5xl" />
      <div className="my-auto space-y-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-haven-500 bg-haven-50 text-3xl font-bold text-haven-700">✓</div>
      <h1 className="text-2xl font-bold text-haven-900">Thank You</h1>
      <p className="text-sm text-haven-700">Your wellbeing check-in has been submitted successfully.</p>
      <div className="rounded-xl border border-haven-200 bg-haven-50/90 p-3 text-sm text-haven-700">
        <p>Your next check-in date: <strong>{formattedDate}</strong></p>
      </div>
      <a
        href={calendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-3d-outline inline-block w-full text-center"
      >
        Add to Calendar
      </a>
      </div>
      <button onClick={() => navigate('/home')} className="btn-3d mt-auto w-full">Return Home</button>
    </div>
  )
}
