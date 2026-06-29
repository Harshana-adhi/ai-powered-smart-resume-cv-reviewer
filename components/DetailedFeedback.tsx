import type { DetailedFeedbackItem } from "@/lib/schema";

interface DetailedFeedbackProps {
  items: DetailedFeedbackItem[];
}

type Category = DetailedFeedbackItem["category"];

const categoryOrder: Category[] = ["clarity", "grammar", "ats_friendliness", "impact"];

const categoryInfo: Record<Category, { label: string; description: string; color: string }> = {
  clarity: {
    label: "Clarity",
    description: "How easy your resume is to read and understand at a glance",
    color: "text-[#60A5FA] bg-[#60A5FA]/10",
  },
  grammar: {
    label: "Grammar",
    description: "Spelling, punctuation, and sentence-level correctness",
    color: "text-[#A78BFA] bg-[#A78BFA]/10",
  },
  ats_friendliness: {
    label: "ATS Friendliness",
    description: "How well it parses through Applicant Tracking Systems used by recruiters",
    color: "text-[#F2A93B] bg-[#F2A93B]/10",
  },
  impact: {
    label: "Impact",
    description: "How well it demonstrates real achievements and measurable results",
    color: "text-[#34D399] bg-[#34D399]/10",
  },
};

export default function DetailedFeedback({ items }: DetailedFeedbackProps) {
  return (
    <div className="mt-2">
      <h2 className="font-serif text-xl font-bold text-[#E8ECF1] mb-1">Detailed Breakdown</h2>
      <p className="text-sm text-[#8B95A3] mb-6">
        Specific issues found in your resume, with suggested fixes.
      </p>

      <div className="space-y-8">
        {categoryOrder.map((category) => {
          const categoryItems = items.filter((item) => item.category === category);
          if (categoryItems.length === 0) return null;

          const info = categoryInfo[category];

          return (
            <div key={category}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${info.color}`}>
                  {info.label}
                </span>
              </div>
              <p className="text-xs text-[#8B95A3] mb-4">{info.description}</p>

              <div className="space-y-4">
                {categoryItems.map((item, index) => (
                  <div key={index} className="border border-[#232B38] rounded-xl p-5 bg-[#141923]">
                    <p className="text-sm font-medium text-[#E8ECF1] mb-2">{item.issue}</p>

                    <blockquote className="text-sm text-[#8B95A3] italic border-l-2 border-[#232B38] pl-3 mb-3 break-words">
                      &ldquo;{item.excerpt}&rdquo;
                    </blockquote>

                    <p className="text-sm text-[#34D399] flex gap-2">
                      <span className="flex-shrink-0">→</span>
                      <span className="text-[#E8ECF1]">{item.fix}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}