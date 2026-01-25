import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { text, fileData, mimeType } = await req.json();

    if (!text && !fileData) {
      return NextResponse.json(
        { error: 'No content provided to parse' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are a professional resume parser. Extract structured information from the provided resume document or text and return it strictly as a JSON object.

The JSON MUST follow this exact structure:
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
      "id": "exp-1",
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, Country or empty",
      "startDate": "MMM YYYY format",
      "endDate": "MMM YYYY format or empty if current",
      "current": boolean,
      "description": "Job responsibilities and achievements"
    }
  ],
  "education": [
    {
      "id": "edu-1",
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
      "id": "skill-1",
      "name": "Skill Name",
      "level": "Intermediate"
    }
  ],
  "languages": [
    {
      "id": "lang-1",
      "name": "Language Name",
      "level": "Fluent"
    }
  ],
  "certificates": [
    {
      "id": "cert-1",
      "name": "Certificate Name",
      "issuer": "Issuing Organization",
      "date": "YYYY or MMM YYYY",
      "url": "string or empty"
    }
  ]
}

Rules:
1. Return ONLY pure JSON. No markdown tags, no backticks, no explanatory text.
2. If a field is missing, use an empty string or empty array.
3. Generate unique IDs for all array items.
4. If providing a summary, make it professional and concise.
5. For experience descriptions, consolidate into a readable block.`;

    let result;
    if (fileData && mimeType) {
      result = await model.generateContent([
        {
          inlineData: {
            data: fileData,
            mimeType: mimeType
          }
        },
        prompt
      ]);
    } else {
      result = await model.generateContent(prompt + `\n\nResume text to parse:\n${text}`);
    }

    const response = await result.response;
    let responseText = response.text();

    // Robust JSON extraction
    try {
      // Remove markdown code blocks if present
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const resume = JSON.parse(responseText);
      return NextResponse.json({ resume });
    } catch (parseError) {
      console.error('JSON Parse Error:', responseText);
      throw new Error('AI returned invalid JSON structure');
    }

  } catch (error) {
    console.error('Detailed Resume parsing error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to parse resume',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
