import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getEntries, clearHistory } from '../utils/storage';
import { getRiskColor } from '../utils/burnoutCalculator';
import { History, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function TimelineView() {
  const [entries, setEntries] = useState(getEntries());
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const handleClearHistory = () => {
    clearHistory();
    setEntries([]);
    setShowConfirmClear(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          7-Day Timeline
        </CardTitle>
        {entries.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirmClear(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          {last7Days.map((date, index) => {
            const entry = entries.find(
              e => new Date(e.date).toDateString() === date.toDateString()
            );
            
            return (
              <div key={index} className="flex flex-col items-center group relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all ${
                    entry ? getRiskColor(entry.riskLevel) : 'bg-gray-300'
                  } ${entry ? 'hover:scale-110 cursor-pointer' : ''}`}
                >
                  {entry ? entry.riskScore : '-'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                
                {entry && (
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap">
                      <div className="font-semibold">{formatDate(date)}</div>
                      <div>Risk: {entry.riskLevel}</div>
                      <div>Hours: {entry.workHours}h</div>
                    </div>
                    <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {entries.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No entries yet. Start your first check-in above!
          </div>
        )}

        {showConfirmClear && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 mb-3">
              Are you sure you want to clear all history? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleClearHistory}
                className="bg-red-600 hover:bg-red-700"
              >
                Clear History
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}