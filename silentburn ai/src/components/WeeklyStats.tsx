import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getEntries } from '../utils/storage';
import { Calendar, Clock, TrendingUp, Award } from 'lucide-react';

export function WeeklyStats() {
  const entries = getEntries();
  const last7Days = entries.slice(0, 7);
  
  const avgRiskScore = last7Days.length > 0 
    ? Math.round(last7Days.reduce((sum, e) => sum + e.riskScore, 0) / last7Days.length)
    : 0;
  
  const totalWorkHours = last7Days.reduce((sum, e) => sum + e.workHours, 0);
  const productiveDays = last7Days.filter(e => e.wasProductive).length;
  const avgMood = last7Days.length > 0
    ? (last7Days.reduce((sum, e) => sum + e.emotionalState, 0) / last7Days.length).toFixed(1)
    : 0;

  const chartData = last7Days.map(entry => ({
    day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
    risk: entry.riskScore,
    mood: 6 - entry.emotionalState // Invert for better visualization
  })).reverse();

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Weekly Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Avg Risk</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{avgRiskScore}</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Total Hours</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{totalWorkHours}h</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-medium">Productive Days</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{productiveDays}/7</div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <span className="text-xs font-medium">Avg Mood</span>
            </div>
            <div className="text-2xl font-bold text-amber-900">{avgMood}/5</div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mood" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {last7Days.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No data for the past week. Start logging to see your stats!
          </div>
        )}
      </CardContent>
    </Card>
  );
}