import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { BurnoutInputs } from '../types';
import { Brain, Heart, Users, CheckCircle, Zap, Moon, AlertTriangle } from 'lucide-react';

interface DailyJournalFormProps {
  onSubmit: (inputs: BurnoutInputs) => void;
  todayEntry?: any;
}

export function DailyJournalForm({ onSubmit, todayEntry }: DailyJournalFormProps) {
  const [workHours, setWorkHours] = useState(todayEntry?.workHours || 8);
  const [emotionalState, setEmotionalState] = useState(todayEntry?.emotionalState || 3);
  const [wasProductive, setWasProductive] = useState(todayEntry?.wasProductive ?? true);
  const [socialConnection, setSocialConnection] = useState(todayEntry?.socialConnection || 3);
  const [energyLevel, setEnergyLevel] = useState(todayEntry?.energyLevel || 3);
  const [sleepQuality, setSleepQuality] = useState(todayEntry?.sleepQuality || 3);
  const [textSummary, setTextSummary] = useState(todayEntry?.textSummary || '');
  const [stressTriggers, setStressTriggers] = useState<string[]>(todayEntry?.stressTriggers || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      workHours,
      emotionalState,
      wasProductive,
      socialConnection,
      energyLevel,
      sleepQuality,
      textSummary,
      stressTriggers
    });
  };

  const emotionEmojis = ['😊', '🙂', '😐', '😔', '😞'];
  const levelEmojis = ['🔋', '🔋🔋', '🔋🔋🔋', '🔋🔋🔋🔋', '🔋🔋🔋🔋🔋'];
  const sleepEmojis = ['😴', '😪', '😐', '🙂', '😊'];

  const triggerOptions = ['Deadline', 'Meetings', 'Client', 'Pressure', 'Urgent', 'Conflict'];
  
  const toggleTrigger = (trigger: string) => {
    setStressTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          Daily Wellness Check-in
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Hours */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <span>⏰</span> Work Hours Today
            </Label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="4"
                max="12"
                value={workHours}
                onChange={(e) => setWorkHours(Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm font-medium w-12 bg-blue-100 px-2 py-1 rounded">{workHours}h</span>
            </div>
          </div>

          {/* Emotional State */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4" />
              How are you feeling?
            </Label>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
              {emotionEmojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setEmotionalState(index + 1)}
                  className={`text-3xl p-2 rounded-lg transition-all transform hover:scale-110 ${
                    emotionalState === index + 1
                      ? 'bg-blue-100 shadow-md scale-110'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Energy Level
            </Label>
            <div className="flex justify-between bg-yellow-50 p-3 rounded-lg">
              {levelEmojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setEnergyLevel(index + 1)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    energyLevel === index + 1
                      ? 'bg-yellow-200 shadow-md'
                      : 'hover:bg-yellow-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Sleep Quality
            </Label>
            <div className="flex justify-between bg-indigo-50 p-3 rounded-lg">
              {sleepEmojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSleepQuality(index + 1)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    sleepQuality === index + 1
                      ? 'bg-indigo-200 shadow-md'
                      : 'hover:bg-indigo-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Productivity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWasProductive(!wasProductive)}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all flex-1 ${
                wasProductive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <CheckCircle className={`w-5 h-5 ${wasProductive ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="font-medium">Felt productive today</span>
            </button>
          </div>

          {/* Social Connection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Social Connection
            </Label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                value={socialConnection}
                onChange={(e) => setSocialConnection(Number(e.target.value))}
                className="flex-1 accent-purple-600"
              />
              <span className="text-sm font-medium w-12 bg-purple-100 px-2 py-1 rounded">{socialConnection}/5</span>
            </div>
          </div>

          {/* Stress Triggers */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Stress Triggers (Select all that apply)
            </Label>
            <div className="flex flex-wrap gap-2">
              {triggerOptions.map((trigger) => (
                <button
                  key={trigger}
                  type="button"
                  onClick={() => toggleTrigger(trigger)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    stressTriggers.includes(trigger)
                      ? 'bg-red-100 text-red-700 border-2 border-red-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </div>

          {/* Text Summary */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4" />
              How did you feel today? (One sentence)
            </Label>
            <Textarea
              value={textSummary}
              onChange={(e) => setTextSummary(e.target.value)}
              placeholder="I felt..."
              className="resize-none border-2 focus:border-blue-400"
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3">
            {todayEntry ? 'Update Today\'s Entry' : 'Save Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}