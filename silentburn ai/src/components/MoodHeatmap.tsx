import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getEntries } from '../utils/storage';
import { getRiskColor } from '../utils/burnoutCalculator';
import { Calendar } from 'lucide-react';

export function MoodHeatmap() {
  const entries = getEntries();
  
  // Generate last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  const getEntryForDate = (date: Date) => {
    return entries.find(e => 
      new Date(e.date).toDateString() === date.toDateString()
    );
  };

  const getIntensity = (score: number) => {
    if (score <= 30) return 1;
    if (score <= 50) return 2;
    if (score <= 70) return 3;
    return 4;
  };

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 1: return 'bg-emerald-200 hover:bg-emerald-300';
      case 2: return 'bg-yellow-200 hover:bg-yellow-300';
      case 3: return 'bg-orange-200 hover:bg-orange-300';
      case 4: return 'bg-red-200 hover:bg-red-300';
      default: return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          30-Day Mood Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Less risk</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-emerald-200 rounded"></div>
              <div className="w-4 h-4 bg-yellow-200 rounded"></div>
              <div className="w-4 h-4 bg-orange-200 rounded"></div>
              <div className="w-4 h-4 bg-red-200 rounded"></div>
            </div>
            <span>More risk</span>
          </div>

          {/* Heatmap Grid */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((day, dayIndex) => {
                  const entry = getEntryForDate(day);
                  const intensity = entry ? getIntensity(entry.riskScore) : 0;
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`w-8 h-8 rounded-sm cursor-pointer transition-all ${
                        intensity > 0 ? getHeatmapColor(intensity) : 'bg-gray-100'
                      } ${entry ? 'ring-1 ring-gray-300' : ''}`}
                      title={
                        entry
                          ? `${day.toLocaleDateString()}: Risk ${entry.riskScore} (${entry.riskLevel})`
                          : `${day.toLocaleDateString()}: No data`
                      }
                    >
                      {entry && (
                        <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                          {entry.riskScore}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Day labels */}
          <div className="flex gap-1 ml-10">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={index} className="w-8 text-xs text-gray-500 text-center">
                {day.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}