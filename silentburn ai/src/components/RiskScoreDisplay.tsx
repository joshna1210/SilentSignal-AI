import { Card, CardContent } from '../components/ui/card';
import { getRiskColor, getRiskTextColor } from '../utils/burnoutCalculator';

interface RiskScoreDisplayProps {
  score: number;
  level: 'low' | 'medium' | 'high';
}

export function RiskScoreDisplay({ score, level }: RiskScoreDisplayProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${getRiskTextColor(level)} transition-all duration-500 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getRiskTextColor(level)}`}>
              {score}
            </div>
            <div className="text-xs text-gray-500">Risk Score</div>
          </div>
        </div>
      </div>
      <Card className={`w-full max-w-xs ${getRiskColor(level)} bg-opacity-10 border-0`}>
        <CardContent className="p-4 text-center">
          <div className={`text-lg font-semibold ${getRiskTextColor(level)}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)} Risk
          </div>
        </CardContent>
      </Card>
    </div>
  );
}