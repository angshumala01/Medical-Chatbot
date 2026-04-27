import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const flaskUrl = process.env.FLASK_API_URL ?? 'http://localhost:8080'

  let flaskRes: Response
  try {
    flaskRes = await fetch(`${flaskUrl}/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `msg=${encodeURIComponent(message)}`,
    })
  } catch {
    return NextResponse.json({ error: 'Could not reach the backend.' }, { status: 502 })
  }

  if (!flaskRes.ok) {
    return NextResponse.json({ error: 'Backend returned an error.' }, { status: 502 })
  }

  const answer = await flaskRes.text()
  return NextResponse.json({ answer })
}
