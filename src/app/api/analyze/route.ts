import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { scanData } = await req.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        report: "### AI Analysis Disabled\n\nThe Gemini AI integration requires a `GEMINI_API_KEY` to be configured in your `.env.local` file.\n\n**Simulated Defensive Report:**\n- **Executive Summary:** The target site lacks fundamental security headers, exposing it to potential Cross-Site Scripting (XSS) and downgrade attacks.\n- **Remediation:** Implement `Strict-Transport-Security` and a robust `Content-Security-Policy`.\n\n*Add your API key to unlock dynamic contextual remediation powered by Google Gemini.*"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a senior cybersecurity defensive expert at Kirov Dynamics Technology.
      Analyze the following passive vulnerability scan results for the target URL: ${scanData.url}
      
      Results: ${JSON.stringify(scanData.results)}
      Tech Stack: ${JSON.stringify(scanData.techStack)}
      Cookie Issues: ${JSON.stringify(scanData.cookieIssues)}
      
      Please provide a professional, concise security posture report. Include:
      1. An executive summary of their defensive posture.
      2. Specific remediation advice for missing headers (provide a sample Nginx or Apache config snippet).
      3. A brief explanation of any cookie or tech stack exposures.
      
      Format the response cleanly without markdown codeblocks wrapping the whole response, but you can use markdown syntax like headers (##) and code blocks for the snippets. Ensure a premium, professional tone.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, report: text });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
