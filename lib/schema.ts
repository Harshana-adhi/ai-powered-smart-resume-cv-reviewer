import { z } from "zod";

const CategorySchema = z.object({
  score: z.number().min(1).max(10),
  feedback: z.array(z.string()).min(1),
});

export const ResumeFeedbackSchema = z.object({
  overall_score: z.number().min(1).max(10),
  categories: z.object({
    clarity: CategorySchema,
    grammar: CategorySchema,
    ats_friendliness: CategorySchema,
    impact: CategorySchema,
  }),
  summary: z.string().min(1),
});

// Type is derived from the schema — single source of truth
export type ResumeFeedback = z.infer<typeof ResumeFeedbackSchema>;