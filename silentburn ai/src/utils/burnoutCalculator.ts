import { BurnoutInputs, Insight } from '../types';

const NEGATIVE_KEYWORDS = ['tired', 'done', "can't", 'overwhelmed', 'exhausted', 'burned', 'stressed', 'drained'];
const POSITIVE_KEYWORDS = ['great', 'good', 'energized', 'focused', 'accomplished', 'productive', 'balanced'];
const STRESS_TRIGGERS = ['deadline', 'meeting', 'client', 'pressure', 'urgent', 'crisis', 'conflict'];

export function calculateRiskScore(inputs: BurnoutInputs): number {
  let score = 0;
  
  // Work hours contribution
  if (inputs.workHours >= 10) score += 20;
  else if (inputs.workHours >= 8) score += 10;
  
  // Emotional state contribution (1 = very happy, 5 = very sad)
  if (inputs.emotionalState >= 4) score += 25;
  else if (inputs.emotionalState >= 3) score += 15;
  
  // Energy level contribution
  if (inputs.energyLevel && inputs.energyLevel >= 4) score += 15;
  else if (inputs.energyLevel && inputs.energyLevel >= 3) score += 8;
  
  // Sleep quality contribution
  if (inputs.sleepQuality && inputs.sleepQuality <= 2) score += 20;
  else if (inputs.sleepQuality && inputs.sleepQuality <= 3) score += 10;
  
  // Productivity contribution
  if (!inputs.wasProductive) score += 15;
  
  // Social connection contribution
  if (inputs.socialConnection <= 2) score += 20;
  else if (inputs.socialConnection <= 3) score += 10;
  
  // Text sentiment analysis
  const lowerText = inputs.textSummary.toLowerCase();
  const hasNegativeKeywords = NEGATIVE_KEYWORDS.some(keyword => lowerText.includes(keyword));
  const hasPositiveKeywords = POSITIVE_KEYWORDS.some(keyword => lowerText.includes(keyword));
  
  if (hasNegativeKeywords) score += 15;
  if (hasPositiveKeywords) score -= 10;
  
  // Stress triggers
  if (inputs.stressTriggers && inputs.stressTriggers.length > 0) {
    score += inputs.stressTriggers.length * 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score <= 30) return 'low';
  if (score <= 65) return 'medium';
  return 'high';
}

export function getRiskColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return 'bg-emerald-500';
    case 'medium': return 'bg-amber-500';
    case 'high': return 'bg-rose-500';
  }
}

export function getRiskTextColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return 'text-emerald-600';
    case 'medium': return 'text-amber-600';
    case 'high': return 'text-rose-600';
  }
}

export function generateInsights(entries: any[]): Insight[] {
  const insights: Insight[] = [];
  
  if (entries.length < 3) return insights;
  
  const recentEntries = entries.slice(0, 7);
  const avgRisk = recentEntries.reduce((sum, e) => sum + e.riskScore, 0) / recentEntries.length;
  const avgHours = recentEntries.reduce((sum, e) => sum + e.workHours, 0) / recentEntries.length;
  const avgMood = recentEntries.reduce((sum, e) => sum + e.emotionalState, 0) / recentEntries.length;
  
  // High work hours warning
  if (avgHours > 9) {
    insights.push({
      type: 'warning',
      title: 'High Workload Detected',
      description: `You're averaging ${avgHours.toFixed(1)} hours per day. Consider setting boundaries.`,
      icon: '⚠️',
      priority: 3
    });
  }
  
  // Mood trend
  if (avgMood > 3.5) {
    insights.push({
      type: 'positive',
      title: 'Positive Mood Trend',
      description: 'Your emotional state has been consistently positive. Keep it up!',
      icon: '🌟',
      priority: 1
    });
  } else if (avgMood < 2.5) {
    insights.push({
      type: 'pattern',
      title: 'Mood Concern',
      description: 'Your mood has been lower than usual. Consider reaching out for support.',
      icon: '💭',
      priority: 2
    });
  }
  
  // Consistency check
  const hasConsistentEntries = recentEntries.length >= 5;
  if (hasConsistentEntries) {
    insights.push({
      type: 'positive',
      title: 'Great Consistency',
      description: `You've logged ${recentEntries.length} entries this week. Consistency builds awareness!`,
      icon: '📈',
      priority: 1
    });
  }
  
  return insights.sort((a, b) => b.priority - a.priority);
}