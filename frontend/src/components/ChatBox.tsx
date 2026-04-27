'use client'

import { useState, useRef, useEffect } from 'react'
import Header from './Header'
import Message from './Message'
import ChatInput from './ChatInput'
import SuggestionChips from './SuggestionChips'

interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  timestamp?: Date
}

const WELCOME: ChatMessage = {
  id: 'init',
  role: 'bot',
  text: "Hello! I'm your Medical Assistant, powered by GPT-4o and a curated medical knowledge base.\n\nI can help you understand medical conditions, symptoms, treatments, medications, and more.\n\nRemember: I'm an AI tool — always consult a qualified healthcare professional for personal medical advice.",
}

const SUGGESTIONS = [
  'What are the symptoms of diabetes?',
  'How does hypertension affect the body?',
  'What is the difference between a virus and bacteria?',
  'What are common treatments for asthma?',
]

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const hasUserMessages = messages.some((m) => m.role === 'user')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: res.ok ? data.answer : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Network error. Please check your connection and try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-blue-100/40">
      <Header />

      {/* Message list */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-6">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            text={msg.text}
            role={msg.role}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Animated typing indicator */}
        {loading && (
          <div className="flex items-end gap-3 fade-in-up">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-base shadow-sm">
              🏥
            </div>
            <div className="rounded-2xl rounded-bl-sm border border-slate-100 bg-slate-50 px-5 py-3.5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — visible until the first user message */}
      {!hasUserMessages && (
        <SuggestionChips
          suggestions={SUGGESTIONS}
          onSelect={handleSend}
          disabled={loading}
        />
      )}

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  )
}
