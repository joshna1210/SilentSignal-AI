import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getEntries } from '../utils/storage';
import { TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';

export function PredictiveInsights() {
  const entries = getEntries();
  const recentEntries = entries.slice(0, 7);
  
  if (recentEntries.length < 3) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Predictive Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Need at least 3 days of data to generate predictions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate trends
  const avgRisk = recentEntries.reduce((sum, e) => sum + e.riskScore, 0) / recentEntries.length;
  const avgHours = recentEntries.reduce((sum, e) => sum + e.workHours, 0) / recentEntries.length;
  const avgMood = recentEntries.reduce((sum, e) => sum + e.emotionalState, 0) / recentEntries.length;
  
  // Predict tomorrow's risk
  const riskTrend = recentEntries.slice(-3).map(e => e.riskScore);
  const isIncreasing = riskTrend[2] > riskTrend[1] && riskTrend[1] > riskTrend[0];
  const tomorrowRisk = isIncreasing ? Math.min(100, avgRisk + 15) : Math.max(0, avgRisk - 5);
  
  // Generate predictions
  const predictions = [
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      title: "Tomorrow's Risk Prediction",
      value: Math.round(tomorrowRisk),
      trend: isIncreasing ? 'increasing' : 'stable',
      color: tomorrowRisk > 65 ? 'text-red-600' : tomorrowRisk > 30 ? 'text-amber-600' : 'text-green-600'
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: "Energy Forecast",
      value: avgMood > 3 ? 'High' : avgMood > 2 ? 'Medium' : 'Low',
      description: 'Based on recent mood patterns',
      color: avgMood > 3 ? 'text-green-600' : avgMood > 2 ? 'text-amber-600' : 'text-red-600'
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      title: "Burnout Probability",
      value: avgRisk > 60 ? 'High' : avgRisk > 35 ? 'Medium' : 'Low',
      description: 'Next 7 days forecast',
      color: avgRisk > 60 ? 'text-red-600' : avgRisk > 35 ? 'text-amber-600' : 'text-green-600'
    }
  ];

  // Recommendations based on predictions
  const recommendations = [];
  
  if (avgHours > 9) {
    recommendations.push("Consider reducing work hours by 1-2 hours");
  }
  
  if (isIncreasing) {
    recommendations.push("Schedule a recovery day soon");
  }
  
  if (avgMood < 3) {
    recommendations.push("Try mood-boosting activities");
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Predictive Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predictions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictions.map((pred, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {pred.icon}
                <span className="text-sm font-medium text-gray-600">{pred.title}</span>
              </div>
              <div className={`text-2xl font-bold ${pred.color}`}>
                {pred.value}
              </div>
              {pred.description && (
                <div className="text-xs text-gray-500 mt-1">{pred.description}</div>
              )}
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Recommended Actions
            </h4>
            <ul className="space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pattern Detection */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2">Pattern Detection</h4>
          <div className="space-y-2 text-sm text-purple-800">
            {avgHours > 8 && (
              <div>• You consistently work {avgHours.toFixed(1)}+ hours/day</div>
            )}
            {recentEntries.filter(e => !e.wasProductive).length > 3 && (
              <div>• Low productivity detected on {recentEntries.filter(e => !e.wasProductive).length} days</div>
            )}
            {recentEntries.filter(e => e.emotionalState >= 4).length > 2 && (
              <div>• Negative mood pattern detected</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}