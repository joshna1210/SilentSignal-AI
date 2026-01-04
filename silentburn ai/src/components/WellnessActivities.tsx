import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Play, Pause, RotateCcw, Heart, Wind, Brain } from 'lucide-react';

export function WellnessActivities() {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const activities = [
    {
      id: 'breathing',
      title: 'Box Breathing',
      description: '4-4-4-4 breathing technique for stress relief',
      duration: 60,
      icon: <Wind className="w-5 h-5 text-blue-500" />,
      instructions: [
        'Inhale for 4 seconds',
        'Hold for 4 seconds',
        'Exhale for 4 seconds',
        'Hold for 4 seconds'
      ]
    },
    {
      id: 'meditation',
      title: 'Quick Meditation',
      description: '5-minute mindfulness session',
      duration: 300,
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      instructions: [
        'Find a comfortable position',
        'Focus on your breath',
        'Notice thoughts without judgment',
        'Return to breath when distracted'
      ]
    },
    {
      id: 'stretch',
      title: 'Desk Stretches',
      description: 'Quick stretches for desk workers',
      duration: 120,
      icon: <Heart className="w-5 h-5 text-red-500" />,
      instructions: [
        'Neck rolls (10 seconds each direction)',
        'Shoulder shrugs (10 seconds)',
        'Wrist stretches (10 seconds each)',
        'Stand and reach (20 seconds)'
      ]
    }
  ];

  const startActivity = (activityId: string, duration: number) => {
    setActiveActivity(activityId);
    setTimeLeft(duration);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetActivity = () => {
    setActiveActivity(null);
    setIsPlaying(false);
    setTimeLeft(0);
  };

  const completeActivity = (activityId: string) => {
    setCompleted([...completed, activityId]);
    resetActivity();
  };

  // Timer effect
  useState(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && activeActivity) {
      completeActivity(activeActivity);
    }
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeActivityData = activities.find(a => a.id === activeActivity);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Quick Wellness Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Activity */}
        {activeActivityData && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {activeActivityData.icon}
                <div>
                  <h3 className="font-semibold text-lg">{activeActivityData.title}</h3>
                  <p className="text-sm text-gray-600">{activeActivityData.description}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {formatTime(timeLeft)}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {activeActivityData.instructions.map((instruction, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    {index + 1}
                  </span>
                  {instruction}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={togglePlayPause}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Resume'}
              </Button>
              <Button
                variant="outline"
                onClick={resetActivity}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activities.map((activity) => {
            const isCompleted = completed.includes(activity.id);
            const isActive = activeActivity === activity.id;
            
            return (
              <div
                key={activity.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : isCompleted
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {activity.icon}
                  <span className="font-medium">{activity.title}</span>
                  {isCompleted && <span className="text-green-600 text-sm">✓</span>}
                </div>
                <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{activity.duration}s</span>
                  <Button
                    size="sm"
                    onClick={() => startActivity(activity.id, activity.duration)}
                    disabled={isActive}
                    variant={isActive ? "secondary" : "default"}
                  >
                    {isActive ? 'Active' : 'Start'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completed Activities Summary */}
        {completed.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Today's Progress</h4>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-green-600">{completed.length}</div>
              <div className="text-sm text-green-800">
                activities completed
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}