interface ScoreCardProps {
  title: string;
  score: number;
  feedback: string[];
}

function getScoreColor(score: number): string {
  if (score < 5) return "text-red-600 bg-red-50 border-red-200";
  if (score <= 7) return "text-yellow-700 bg-yellow-50 border-yellow-200";
  return "text-green-700 bg-green-50 border-green-200";
}

export default function ScoreCard({ title, score, feedback }: ScoreCardProps) {
  const colorClasses = getScoreColor(score);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span
          className={`text-sm font-bold px-2.5 py-1 rounded-full border ${colorClasses}`}
        >
          {score}/10
        </span>
      </div>
      <ul className="space-y-1.5">
        {feedback.map((point, index) => (
          <li key={index} className="text-sm text-gray-600 flex gap-2">
            <span className="text-gray-400">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}