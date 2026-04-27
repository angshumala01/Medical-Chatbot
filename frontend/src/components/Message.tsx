export interface MessageProps {
  text: string
  role: 'user' | 'bot'
  timestamp?: Date
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Message({ text, role, timestamp }: MessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex items-end gap-3 fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm shadow-sm ${
          isUser ? 'bg-slate-200 text-slate-500' : 'bg-blue-600 text-white'
        }`}
      >
        {isUser ? '👤' : '🏥'}
      </div>

      {/* Bubble + timestamp */}
      <div className={`flex max-w-[75%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'rounded-br-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200/50'
              : 'rounded-bl-sm border border-slate-100 bg-white text-gray-800 shadow-sm'
          }`}
        >
          {text}
        </div>
        {timestamp && (
          <span className="px-1 text-[10px] text-slate-400">{formatTime(timestamp)}</span>
        )}
      </div>
    </div>
  )
}
