import { Card, CardContent } from '../components/ui/card';
import { getRiskColor, getRiskTextColor } from '../utils/burnoutCalculator';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EnhancedRiskScoreDisplayProps {
  score: number;
  level: 'low' | 'medium' | 'high';
  trend?: 'up' | 'down' | 'stable';
  streak?: number;
}

export function EnhancedRiskScoreDisplay({ 
  score, 
  level, 
  trend = 'stable', 
  streak = 0 
}: EnhancedRiskScoreDisplayProps) {
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-rose-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-emerald-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'up': return 'Risk increasing';
      case 'down': return 'Risk decreasing';
      default: return 'Stable';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="50"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="72"
              cy="72"
              r="50"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${getRiskTextColor(level)} transition-all duration-700 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-bold ${getRiskTextColor(level)}`}>
              {score}
            </div>
            <div className="text-xs text-gray-500">Risk Score</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          {getTrendIcon()}
          <span className="text-gray-600">{getTrendText()}</span>
        </div>
        
        {streak > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 rounded-full">
            <span className="text-amber-600 font-semibold">{streak}</span>
            <span className="text-amber-600 text-sm">day streak</span>
          </div>
        )}
      </div>
      
      <Card className={`w-full max-w-xs mx-auto ${getRiskColor(level)} bg-opacity-10 border-0`}>
        <CardContent className="p-4 text-center">
          <div className={`text-xl font-semibold ${getRiskTextColor(level)}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)} Risk
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {level === 'low' && 'You\'re doing great!'}
            {level === 'medium' && 'Pay attention to warning signs.'}
            {level === 'high' && 'Take action to prevent burnout.'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}