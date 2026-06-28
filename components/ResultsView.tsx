import type { ResumeFeedback } from "@/lib/schema";
import ScoreCard from "./ScoreCard";

interface ResultsViewProps {
  feedback: ResumeFeedback;
  onReset: () => void;
}

function getOverallScoreColor(score: number): string {
  if (score < 5) return "text-red-600";
  if (score <= 7) return "text-yellow-700";
  return "text-green-700";
}

export default function ResultsView({ feedback, onReset }: ResultsViewProps) {
  const { overall_score, categories, summary } = feedback;

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Overall score */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">Overall Score</p>
        <p className={`text-5xl font-bold ${getOverallScoreColor(overall_score)}`}>
          {overall_score}/10
        </p>
      </div>

      {/* Summary */}
      <p className="text-center text-gray-600 mb-8 px-4">{summary}</p>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <ScoreCard
          title="Clarity"
          score={categories.clarity.score}
          feedback={categories.clarity.feedback}
        />
        <ScoreCard
          title="Grammar"
          score={categories.grammar.score}
          feedback={categories.grammar.feedback}
        />
        <ScoreCard
          title="ATS Friendliness"
          score={categories.ats_friendliness.score}
          feedback={categories.ats_friendliness.feedback}
        />
        <ScoreCard
          title="Impact"
          score={categories.impact.score}
          feedback={categories.impact.feedback}
        />
      </div>

      {/* Reset button (FR11) */}
      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
        >
          Try another resume
        </button>
      </div>
    </div>
  );
}