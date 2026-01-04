export interface JournalEntry {
  id: string;
  date: string;
  workHours: number;
  emotionalState: number; // 1-5 scale
  wasProductive: boolean;
  socialConnection: number; // 1-5 scale
  textSummary: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  energyLevel?: number; // 1-5 scale
  sleepQuality?: number; // 1-5 scale
  stressTriggers?: string[];
}

export interface WellnessTip {
  level: 'low' | 'medium' | 'high';
  text: string;
  icon: string;
  category: 'rest' | 'social' | 'productivity' | 'mindfulness';
}

export interface BurnoutInputs {
  workHours: number;
  emotionalState: number;
  wasProductive: boolean;
  socialConnection: number;
  textSummary: string;
  energyLevel?: number;
  sleepQuality?: number;
  stressTriggers?: string[];
}

export interface WeeklyStats {
  avgRiskScore: number;
  totalWorkHours: number;
  productiveDays: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  streak: number;
  entriesCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Insight {
  type: 'pattern' | 'warning' | 'positive';
  title: string;
  description: string;
  icon: string;
  priority: number;
}