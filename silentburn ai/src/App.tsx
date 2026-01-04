import { useState, useEffect } from 'react';
import { DailyJournalForm } from './components/DailyJournalForm';
import { EnhancedRiskScoreDisplay } from './components/EnhancedRiskScoreDisplay';
import { MoodHeatmap } from './components/MoodHeatmap';
import { PredictiveInsights } from './components/PredictiveInsights';
import { WellnessActivities } from './components/WellnessActivities';
import { GoalsTracker } from './components/GoalsTracker';
import { WeeklyStats } from './components/WeeklyStats';
import { InsightsPanel } from './components/InsightsPanel';
import { AchievementsPanel } from './components/AchievementsPanel';
import { WellnessTipCard } from './components/WellnessTipCard';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Brain, ChevronDown, ChevronUp, Shield, BarChart3, Calendar, Target, Heart, Award, TrendingUp } from 'lucide-react';
import { 
  JournalEntry, 
  BurnoutInputs, 
  WellnessTip 
} from './types';
import { 
  calculateRiskScore, 
  getRiskLevel 
} from './utils/burnoutCalculator';
import { 
  saveEntry, 
  getEntries, 
  getTodayEntry,
  getStreak
} from './utils/storage';
import { getRandomTip } from './utils/tips';

function App() {
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [currentLevel, setCurrentLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [currentTip, setCurrentTip] = useState<WellnessTip | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [todayEntry, setTodayEntry] = useState<JournalEntry | undefined>();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const storedEntries = getEntries();
    setEntries(storedEntries);
    
    const today = getTodayEntry();
    setTodayEntry(today);
    
    const currentStreak = getStreak();
    setStreak(currentStreak);
    
    if (today) {
      setCurrentScore(today.riskScore);
      setCurrentLevel(today.riskLevel);
      setCurrentTip(getRandomTip(today.riskLevel));
    }
  }, []);

  const handleSubmit = (inputs: BurnoutInputs) => {
    const score = calculateRiskScore(inputs);
    const level = getRiskLevel(score);
    const tip = getRandomTip(level);
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...inputs,
      riskScore: score,
      riskLevel: level
    };
    
    saveEntry(entry);
    setEntries([entry, ...entries]);
    setTodayEntry(entry);
    setCurrentScore(score);
    setCurrentLevel(level);
    setCurrentTip(tip);
    setStreak(getStreak());
    setIsFormExpanded(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'heatmap', label: 'Heatmap', icon: <Calendar className="w-4 h-4" /> },
    { id: 'insights', label: 'Predictions', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'activities', label: 'Activities', icon: <Heart className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SilentBurn AI</h1>
                <p className="text-xs text-gray-500">Your private burnout detection companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 rounded-full">
                  <span className="text-amber-600 font-semibold">{streak}</span>
                  <span className="text-amber-600 text-sm">day streak 🔥</span>
                </div>
              )}
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {currentScore !== null && currentLevel !== null && (
              <div className="space-y-6">
                <EnhancedRiskScoreDisplay 
                  score={currentScore} 
                  level={currentLevel}
                  streak={streak}
                />
                
                {currentTip && (
                  <WellnessTipCard tip={currentTip} />
                )}
              </div>
            )}

            {/* Journal Form */}
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setIsFormExpanded(!isFormExpanded)}
                className="w-full flex items-center justify-between bg-white"
              >
                <span>{todayEntry ? 'Update Today\'s Entry' : 'Daily Check-in'}</span>
                {isFormExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              
              {isFormExpanded && (
                <DailyJournalForm 
                  onSubmit={handleSubmit} 
                  todayEntry={todayEntry}
                />
              )}
            </div>

            <WeeklyStats />
            <InsightsPanel />
          </div>
        )}

        {/* Heatmap Tab */}
        {activeTab === 'heatmap' && (
          <div className="space-y-8">
            <MoodHeatmap />
            <WeeklyStats />
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-8">
            <PredictiveInsights />
            <InsightsPanel />
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-8">
            <WellnessActivities />
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-8">
            <GoalsTracker />
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <AchievementsPanel />
          </div>
        )}

        {/* Privacy Notice */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Your data stays on this device. No tracking. No cloud storage.</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default App;