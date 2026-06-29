import type { ResumeFeedback } from "@/lib/schema";
import ScoreCard from "./ScoreCard";
import DetailedFeedback from "./DetailedFeedback";

interface ResultsViewProps {
  feedback: ResumeFeedback;
  onReset: () => void;
}

function getOverallScoreColor(score: number): string {
  if (score < 5) return "text-[#F87171]";
  if (score <= 7) return "text-[#FBBF24]";
  return "text-[#34D399]";
}

export default function ResultsView({ feedback, onReset }: ResultsViewProps) {
  const { overall_score, categories, summary, detailed_feedback } = feedback;
  const scoreColor = getOverallScoreColor(overall_score);

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Overall score */}
      <div className="text-center mb-8">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8B95A3] mb-2">
          Overall Score
        </p>
        <p className={`font-mono text-6xl font-bold ${scoreColor}`}>
          {overall_score}<span className="text-2xl text-[#8B95A3]">/10</span>
        </p>
      </div>

      {/* Summary */}
      <div className="border-l-2 border-[#F2A93B] bg-[#141923] rounded-r-lg px-5 py-4 mb-8">
        <p className="text-[#E8ECF1] text-sm leading-relaxed">{summary}</p>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <ScoreCard title="Clarity" score={categories.clarity.score} feedback={categories.clarity.feedback} />
        <ScoreCard title="Grammar" score={categories.grammar.score} feedback={categories.grammar.feedback} />
        <ScoreCard
          title="ATS Friendliness"
          score={categories.ats_friendliness.score}
          feedback={categories.ats_friendliness.feedback}
        />
        <ScoreCard title="Impact" score={categories.impact.score} feedback={categories.impact.feedback} />
      </div>

      {/* Detailed breakdown */}
      <div className="mb-10">
        <DetailedFeedback items={detailed_feedback} />
      </div>

      {/* Reset button */}
      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#232B38] text-[#E8ECF1] font-medium text-sm hover:bg-[#2D3645] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Another Resume
        </button>
      </div>
    </div>
  );
}