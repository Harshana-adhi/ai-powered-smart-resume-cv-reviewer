import { z } from "zod";

const CategorySchema = z.object({
  score: z.number().min(1).max(10),
  feedback: z.array(z.string()).min(1), // short bullet points for the score card
});

const DetailedFeedbackItemSchema = z.object({
  category: z.enum(["clarity", "grammar", "ats_friendliness", "impact"]),
  issue: z.string().min(1),
  excerpt: z.string().min(1), // exact quoted text from the resume
  fix: z.string().min(1), // concrete suggested rewrite
});

export const ResumeFeedbackSchema = z.object({
  is_resume: z.literal(true),
  overall_score: z.number().min(1).max(10),
  categories: z.object({
    clarity: CategorySchema,
    grammar: CategorySchema,
    ats_friendliness: CategorySchema,
    impact: CategorySchema,
  }),
  summary: z.string().min(1),
  detailed_feedback: z.array(DetailedFeedbackItemSchema).min(1),
});

export type DetailedFeedbackItem = z.infer<typeof DetailedFeedbackItemSchema>;
export type ResumeFeedback = z.infer<typeof ResumeFeedbackSchema>;

export const NotResumeSchema = z.object({
  is_resume: z.literal(false),
  reason: z.string().min(1),
});

export type NotResumeResult = z.infer<typeof NotResumeSchema>;

export const AiResponseSchema = z.union([ResumeFeedbackSchema, NotResumeSchema]);
export type AiResponse = z.infer<typeof AiResponseSchema>;