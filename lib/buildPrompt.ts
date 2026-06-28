// Builds the prompt sent to the LLM (SRS Section 9)
// Truncates resume text to stay within token limits (SRS Section 10 risk mitigation)

const MAX_RESUME_CHARS = 12000; // safe char limit to avoid exceeding free-tier token limits

export function buildPrompt(resumeText: string): string {
  const truncatedText = resumeText.slice(0, MAX_RESUME_CHARS);

  return `You are an expert resume reviewer and ATS specialist.

Analyze the following resume text and return ONLY valid JSON (no markdown, no preamble) in this exact structure:

{
  "overall_score": <1-10 integer>,
  "categories": {
    "clarity": { "score": <1-10>, "feedback": ["point 1", "point 2"] },
    "grammar": { "score": <1-10>, "feedback": ["point 1", "point 2"] },
    "ats_friendliness": { "score": <1-10>, "feedback": ["point 1", "point 2"] },
    "impact": { "score": <1-10>, "feedback": ["point 1", "point 2"] }
  },
  "summary": "<one or two sentence overall verdict>"
}

Resume text:
"""
${truncatedText}
"""`;
}