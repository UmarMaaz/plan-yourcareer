import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const { position, company, section } = await request.json()

    if (!position && section !== 'summary') {
      return NextResponse.json(
        { error: 'Position is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    const prompt = buildPrompt(section, position, company)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ description: text.trim() })
  } catch (error) {
    console.error('Description generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    )
  }
}

function buildPrompt(section: string, position: string, company: string): string {
  if (section === 'summary') {
    return `You are a professional resume writer. Write a concise, high-impact, ATS-friendly professional summary for a ${position || 'professional'} role. 
    Maximum 3 short, punchy sentences. Focus on key skills and value.
    Output ONLY the summary text, no extra formatting, markdown or intro/outro.`
  }

  return `You are a professional resume writer. Write a concise, ATS-optimized job description for the role of "${position}" at "${company || 'a company'}".
  Use strong action verbs and focus on quantifiable achievements. 
  Format as EXACTLY 3-4 professional bullet points (starting with •). 
  Keep each point short and impactful.
  Output ONLY the bullet points, no extra formatting, markdown headers, or introductory text.`
}
