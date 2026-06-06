import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import HavenLogo from '../components/HavenLogo'

const messages = [
  { role: 'ai' as const, message: 'Hi, I’m Haven Assistant. How can I support you today?' },
  { role: 'user' as const, message: 'I feel overwhelmed with deadlines.' },
  { role: 'ai' as const, message: 'Thanks for sharing. Try a 2-minute breathing reset and prioritize one small task first.' },
  { role: 'ai' as const, message: 'If stress stays high, consider checking in with your manager or EAP support.' }
]

export default function AIChatPage() {
  const navigate = useNavigate()

  return (
    <div className="app-page-bg app-page-content flex min-h-[640px] flex-col px-5 py-8">
      <HavenLogo className="text-4xl md:text-5xl" />
      <h1 className="mt-8 text-center text-2xl font-bold text-haven-900">AI Agent</h1>
      <div className="my-auto space-y-3">
      <div className="space-y-2 rounded-xl border border-haven-200 bg-white/90 p-3">
        {messages.map((item, idx) => <ChatBubble key={idx} role={item.role} message={item.message} />)}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-haven-200 bg-white/90 p-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full rounded-lg border border-haven-200 px-3 py-2 text-sm outline-none focus:border-haven-400"
        />
        <button type="button" className="btn-3d rounded-lg px-3 py-2 text-sm">
          Send
        </button>
      </div>
      </div>
      <button onClick={() => navigate('/home')} className="btn-3d mt-auto w-full">Return Home</button>
    </div>
  )
}
