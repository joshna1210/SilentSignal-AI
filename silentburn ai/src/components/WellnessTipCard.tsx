import { Card, CardContent } from '../components/ui/card';
import { WellnessTip } from '../types';

interface WellnessTipCardProps {
  tip: WellnessTip;
}

export function WellnessTipCard({ tip }: WellnessTipCardProps) {
  const getTipColor = (level: string) => {
    switch (level) {
      case 'low': return 'from-emerald-50 to-green-50 border-emerald-200';
      case 'medium': return 'from-amber-50 to-yellow-50 border-amber-200';
      case 'high': return 'from-rose-50 to-red-50 border-rose-200';
      default: return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getTipIconColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-600';
      case 'medium': return 'text-amber-600';
      case 'high': return 'text-rose-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto bg-gradient-to-r ${getTipColor(tip.level)} border-2`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`text-3xl ${getTipIconColor(tip.level)}`}>
            {tip.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Today's Wellness Tip</h3>
            <p className="text-gray-700 leading-relaxed">{tip.text}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-70 ${getTipIconColor(tip.level)}`}>
                {tip.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-70 ${getTipIconColor(tip.level)}`}>
                {tip.level} risk
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}