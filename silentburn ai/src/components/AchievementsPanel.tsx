import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getAchievements } from '../utils/storage';
import { Trophy, Lock, Star } from 'lucide-react';

export function AchievementsPanel() {
  const achievements = getAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          Achievements
          <span className="text-sm font-normal text-gray-500">
            ({unlockedCount}/{achievements.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {achievement.unlocked ? (
                    <div className="relative">
                      <span>{achievement.icon}</span>
                      <Star className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 fill-current" />
                    </div>
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-amber-600 mt-2">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}