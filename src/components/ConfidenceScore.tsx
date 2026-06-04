/**
 * Visual confidence score indicator.
 *
 * Displays the AI's confidence level as a percentage with a
 * color-coded progress ring and label.
 *
 * Color ranges:
 * - 0-39:  Red (low confidence)
 * - 40-69: Amber (medium confidence)
 * - 70-100: Green (high confidence)
 */
interface ConfidenceScoreProps {
  score: number;
}

export default function ConfidenceScore({ score }: ConfidenceScoreProps) {
  const getColor = () => {
    if (score >= 70) return { ring: 'text-success-500', bg: 'bg-success-500/10', label: 'text-success-600' };
    if (score >= 40) return { ring: 'text-warning-500', bg: 'bg-warning-500/10', label: 'text-warning-600' };
    return { ring: 'text-danger-500', bg: 'bg-danger-500/10', label: 'text-danger-600' };
  };

  const getLabel = () => {
    if (score >= 70) return 'High Confidence';
    if (score >= 40) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const colors = getColor();
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        {/* Background ring */}
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-surface-100"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={colors.ring}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${colors.label}`}>{score}%</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-medium ${colors.label}`}>{getLabel()}</span>
    </div>
  );
}
