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

    const { resumeData, section, fieldValue, jobTitle } = await request.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    const prompt = buildPrompt(section, fieldValue, jobTitle, resumeData)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const suggestions = parseResponse(text)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('ATS suggestions error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}

function buildPrompt(
  section: string,
  fieldValue: string,
  jobTitle: string,
  resumeData: any
): string {
  const baseContext = `You are an expert ATS (Applicant Tracking System) resume consultant. Your goal is to help users create ATS-friendly resumes that pass automated screening systems and appeal to recruiters.

Target Job Title: ${jobTitle || 'Not specified'}

Current Resume Data:
${JSON.stringify(resumeData, null, 2)}
`

  switch (section) {
    case 'summary':
      return `${baseContext}

The user is writing their PROFESSIONAL SUMMARY:
"${fieldValue}"

Provide 3 specific, actionable suggestions to make this summary more ATS-friendly. Focus on:
1. Including relevant keywords for ${jobTitle || 'their target role'}
2. Quantifiable achievements
3. Clear, concise language that ATS systems can parse

Format your response as a JSON array of objects with "title" and "suggestion" fields. Example:
[{"title": "Add Keywords", "suggestion": "Include industry-specific terms like..."}]

Only return the JSON array, no other text.`

    case 'experience':
      return `${baseContext}

The user is writing a JOB DESCRIPTION for their experience:
"${fieldValue}"

Provide 3 specific, actionable suggestions to make this experience description more ATS-friendly. Focus on:
1. Using strong action verbs
2. Including measurable results (numbers, percentages, dollar amounts)
3. Incorporating relevant keywords for ${jobTitle || 'their target role'}

Format your response as a JSON array of objects with "title" and "suggestion" fields. Example:
[{"title": "Use Action Verbs", "suggestion": "Start with powerful verbs like 'Achieved', 'Implemented'..."}]

Only return the JSON array, no other text.`

    case 'skills':
      return `${baseContext}

The user has listed these SKILLS:
${fieldValue}

Provide 3 specific suggestions for improving their skills section for ATS. Focus on:
1. Missing essential skills for ${jobTitle || 'their target role'}
2. Proper formatting (individual skills vs skill categories)
3. Both hard and soft skills balance

Format your response as a JSON array of objects with "title" and "suggestion" fields.
Only return the JSON array, no other text.`

    case 'overall':
      return `${baseContext}

Analyze this resume for ATS optimization and provide 5 specific, actionable suggestions. Consider:
1. Keyword optimization for ${jobTitle || 'the target role'}
2. Formatting issues that might confuse ATS systems
3. Missing sections or information
4. Quantifiable achievements
5. Overall structure and readability

Format your response as a JSON array of objects with "title", "suggestion", and "priority" (high/medium/low) fields.
Only return the JSON array, no other text.`

    default:
      return `${baseContext}

Provide 3 general ATS optimization tips for resumes.
Format your response as a JSON array of objects with "title" and "suggestion" fields.
Only return the JSON array, no other text.`
  }
}

function parseResponse(text: string): Array<{ title: string; suggestion: string; priority?: string }> {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return [{ title: 'AI Suggestion', suggestion: text }]
  } catch {
    return [{ title: 'AI Suggestion', suggestion: text }]
  }
}
