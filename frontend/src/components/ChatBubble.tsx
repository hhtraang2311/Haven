type ChatBubbleProps = {
  role: 'user' | 'ai'
  message: string
}

export default function ChatBubble({ role, message }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
          isUser ? 'bg-haven-500 text-white' : 'bg-haven-100 text-haven-800'
        }`}
      >
        {message}
      </div>
    </div>
  )
}
