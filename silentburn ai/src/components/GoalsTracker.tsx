import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Target, Plus, CheckCircle, Circle } from 'lucide-react';
import { getEntries } from '../utils/storage';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  type: 'daily' | 'weekly';
  color: string;
}

export function GoalsTracker() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Daily Check-ins',
      target: 7,
      current: 0,
      unit: 'days',
      type: 'weekly',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Work Hours Limit',
      target: 40,
      current: 0,
      unit: 'hours',
      type: 'weekly',
      color: 'bg-purple-500'
    },
    {
      id: '3',
      title: 'Wellness Activities',
      target: 5,
      current: 0,
      unit: 'sessions',
      type: 'weekly',
      color: 'bg-green-500'
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);

  // Update goals progress based on actual data
  const entries = getEntries();
  const thisWeekEntries = entries.filter(e => {
    const entryDate = new Date(e.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate > weekAgo;
  });

  // Update goals with real data
  const updatedGoals = goals.map(goal => {
    if (goal.id === '1') {
      return { ...goal, current: thisWeekEntries.length };
    }
    if (goal.id === '2') {
      const totalHours = thisWeekEntries.reduce((sum, e) => sum + e.workHours, 0);
      return { ...goal, current: totalHours };
    }
    return goal;
  });

  const progress = (goal: Goal) => Math.min(100, (goal.current / goal.target) * 100);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Wellness Goals
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Goals List */}
        <div className="space-y-4">
          {updatedGoals.map((goal) => {
            const goalProgress = progress(goal);
            const isCompleted = goalProgress >= 100;
            
            return (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <h3 className="font-semibold">{goal.title}</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    {goal.current}/{goal.target} {goal.unit}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${goal.color} transition-all duration-500 ease-out`}
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
                
                {/* Status */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {Math.round(goalProgress)}% complete
                  </span>
                  {isCompleted && (
                    <span className="text-sm font-medium text-green-600">Goal achieved! 🎉</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Goal Form */}
        {showAddGoal && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h4 className="font-medium mb-3">Create New Goal</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Goal title..."
                className="w-full px-3 py-2 border rounded-md"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Target"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <select className="flex-1 px-3 py-2 border rounded-md">
                  <option>daily</option>
                  <option>weekly</option>
                  <option>monthly</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button size="sm">Create Goal</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">This Week's Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Check-ins</div>
              <div className="font-semibold">{thisWeekEntries.length}/7</div>
            </div>
            <div>
              <div className="text-gray-600">Avg Risk</div>
              <div className="font-semibold">
                {thisWeekEntries.length > 0 
                  ? Math.round(thisWeekEntries.reduce((sum, e) => sum + e.riskScore, 0) / thisWeekEntries.length)
                  : 0}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Total Hours</div>
              <div className="font-semibold">
                {thisWeekEntries.reduce((sum, e) => sum + e.workHours, 0)}h
              </div>
            </div>
            <div>
              <div className="text-gray-600">Productive Days</div>
              <div className="font-semibold">
                {thisWeekEntries.filter(e => e.wasProductive).length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}