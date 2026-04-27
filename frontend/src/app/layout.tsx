import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Medical Assistant',
  description: 'AI-powered medical Q&A using RAG and GPT-4o',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50`}
      >
        {children}
      </body>
    </html>
  )
}
