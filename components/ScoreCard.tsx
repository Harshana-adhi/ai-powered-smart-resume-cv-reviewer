interface ScoreCardProps {
  title: string;
  score: number;
  feedback: string[];
}

function getScoreStyles(score: number): { ring: string; text: string; bg: string; dot: string } {
  if (score < 5) return { ring: "ring-[#F87171]/30", text: "text-[#F87171]", bg: "bg-[#F87171]/10", dot: "bg-[#F87171]" };
  if (score <= 7) return { ring: "ring-[#FBBF24]/30", text: "text-[#FBBF24]", bg: "bg-[#FBBF24]/10", dot: "bg-[#FBBF24]" };
  return { ring: "ring-[#34D399]/30", text: "text-[#34D399]", bg: "bg-[#34D399]/10", dot: "bg-[#34D399]" };
}

export default function ScoreCard({ title, score, feedback }: ScoreCardProps) {
  const styles = getScoreStyles(score);

  return (
    <div className="border border-[#232B38] rounded-xl p-5 bg-[#141923] hover:bg-[#171D29] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#E8ECF1] uppercase tracking-wide">{title}</h3>
        <span
          className={`font-mono text-sm font-bold px-2.5 py-1 rounded-full ring-1 ${styles.ring} ${styles.text} ${styles.bg}`}
        >
          {score}/10
        </span>
      </div>
      <ul className="space-y-2">
        {feedback.map((point, index) => (
          <li key={index} className="text-sm text-[#8B95A3] flex gap-2 leading-relaxed">
            <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${styles.dot}`} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}