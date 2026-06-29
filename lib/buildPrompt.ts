const MAX_RESUME_CHARS = 12000;

export function buildPrompt(resumeText: string): string {
  const truncatedText = resumeText.slice(0, MAX_RESUME_CHARS);

  return `You are an expert resume reviewer and ATS specialist.

First, determine whether the text below is actually a resume/CV (a document listing a person's skills, work experience, education, or qualifications for employment).

If it is NOT a resume/CV, respond with ONLY this JSON (no markdown, no preamble):
{
  "is_resume": false,
  "reason": "<one sentence explaining why this doesn't look like a resume>"
}

If it IS a resume/CV, respond with ONLY this exact JSON shape (no markdown, no preamble). Pay close attention: "feedback" arrays inside "categories" must contain PLAIN STRINGS ONLY, never objects. The detailed issue/excerpt/fix breakdown belongs ONLY in the separate "detailed_feedback" array at the bottom.

{
  "is_resume": true,
  "overall_score": <1-10 integer>,
  "categories": {
    "clarity": { "score": <1-10>, "feedback": ["short plain-text point, under 12 words", "another short plain-text point"] },
    "grammar": { "score": <1-10>, "feedback": ["short plain-text point", "another short plain-text point"] },
    "ats_friendliness": { "score": <1-10>, "feedback": ["short plain-text point", "another short plain-text point"] },
    "impact": { "score": <1-10>, "feedback": ["short plain-text point", "another short plain-text point"] }
  },
  "summary": "<one or two sentence overall verdict>",
  "detailed_feedback": [
    {
      "category": "clarity",
      "issue": "<specific description of what's wrong>",
      "excerpt": "<exact text copied verbatim from the resume>",
      "fix": "<concrete, specific rewrite or suggestion>"
    }
  ]
}

Reminder: categories.clarity.feedback, categories.grammar.feedback, categories.ats_friendliness.feedback, and categories.impact.feedback must each be an array of plain strings — example of WRONG: { "issue": "...", "fix": "..." }. Example of CORRECT: "Summary lacks quantifiable achievements".

For "detailed_feedback": provide 4-8 items total across all categories, covering the most important issues. Each "excerpt" must be copied verbatim from the resume text below. The "category" field must be exactly one of: clarity, grammar, ats_friendliness, impact.

Resume text:
"""
${truncatedText}
"""`;
}