import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || text.trim().length < 50) {
            return NextResponse.json(
                { error: 'Insufficient text content to parse' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a resume parser. Extract structured information from the following resume text and return it as a JSON object.

The JSON must follow this exact structure:
{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string or empty",
    "phone": "string or empty",
    "jobTitle": "string or empty",
    "summary": "string - professional summary or objective",
    "address": "string or empty",
    "website": "string or empty",
    "linkedin": "string or empty",
    "github": "string or empty"
  },
  "experience": [
    {
      "id": "unique-id-1",
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, Country or empty",
      "startDate": "MMM YYYY format",
      "endDate": "MMM YYYY format or empty if current",
      "current": boolean,
      "description": "Job responsibilities and achievements, each on a new line"
    }
  ],
  "education": [
    {
      "id": "unique-id-1",
      "school": "School/University Name",
      "degree": "Degree and Field of Study",
      "location": "City, Country or empty",
      "startDate": "YYYY format",
      "endDate": "YYYY format",
      "current": boolean
    }
  ],
  "skills": [
    {
      "id": "unique-id-1",
      "name": "Skill Name",
      "level": "Beginner" | "Intermediate" | "Advanced" | "Expert" or null
    }
  ],
  "languages": [
    {
      "id": "unique-id-1",
      "name": "Language Name",
      "level": "Native" | "Fluent" | "Conversational" | "Basic"
    }
  ],
  "certificates": [
    {
      "id": "unique-id-1",
      "name": "Certificate Name",
      "issuer": "Issuing Organization",
      "date": "YYYY or MMM YYYY",
      "url": "string or empty"
    }
  ]
}

Important rules:
1. Return ONLY the JSON object, no other text or markdown
2. Generate unique IDs for each array item (use format like "exp-1", "edu-1", "skill-1", etc.)
3. Parse dates into the specified formats
4. If a field cannot be determined, use an empty string
5. For experience descriptions, format as bullet points with each achievement on a new line
6. Extract ALL experience, education, skills, languages, and certificates you can find
7. For the summary, create a brief professional summary if one isn't explicitly stated

Resume text to parse:
${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Clean up the response - remove markdown code blocks if present
        let jsonText = responseText.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.slice(7);
        }
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.slice(3);
        }
        if (jsonText.endsWith('```')) {
            jsonText = jsonText.slice(0, -3);
        }
        jsonText = jsonText.trim();

        const resume = JSON.parse(jsonText);

        return NextResponse.json({ resume });
    } catch (error) {
        console.error('Resume parsing error:', error);
        return NextResponse.json(
            { error: 'Failed to parse resume' },
            { status: 500 }
        );
    }
}
