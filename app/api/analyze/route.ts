import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { extractTextFromPdf, FileValidationError } from "@/lib/extractText";
import { buildPrompt } from "@/lib/buildPrompt";
import { ResumeFeedbackSchema } from "@/lib/schema";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const pastedText = formData.get("text") as string | null;

    let resumeText = "";

    // FR1/FR2: support either PDF upload or pasted text
    if (file) {
      try {
        resumeText = await extractTextFromPdf(file);
      } catch (err) {
        if (err instanceof FileValidationError) {
          return NextResponse.json({ error: err.message }, { status: 400 });
        }
        throw err;
      }
    } else if (pastedText && pastedText.trim().length > 0) {
      resumeText = pastedText.trim();
    } else {
      return NextResponse.json(
        { error: "Please upload a PDF or paste resume text." },
        { status: 400 }
      );
    }

   // OCR fallback already attempted inside extractTextFromPdf.
    // If we still have nothing meaningful, give up gracefully.
    if (resumeText.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "We couldn't extract readable text from this PDF, even with OCR. Please paste your resume text instead.",
        },
        { status: 400 }
      );
    }

    // FR5: send to LLM with structured prompt
    const prompt = buildPrompt(resumeText);

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });
    } catch (err) {
      // NFR-4: handle rate limits / API errors gracefully
      console.error("Groq API error:", err);
      return NextResponse.json(
        { error: "The AI service is temporarily unavailable. Please try again shortly." },
        { status: 502 }
      );
    }

    const rawText = completion.choices[0]?.message?.content ?? "";

    // FR6/FR7: parse and validate the AI's JSON response
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (err) {
      console.error("Failed to JSON.parse AI response:", rawText);
      return NextResponse.json(
        { error: "AI returned an unreadable response. Please try again." },
        { status: 502 }
      );
    }

    const result = ResumeFeedbackSchema.safeParse(parsedJson);
    if (!result.success) {
      console.error("AI response failed schema validation:", result.error.issues);
      return NextResponse.json(
        { error: "AI returned an unexpected response shape. Please try again." },
        { status: 502 }
      );
    }

    // Validated, fully typed ResumeFeedback object
    return NextResponse.json(result.data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in /api/analyze:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}