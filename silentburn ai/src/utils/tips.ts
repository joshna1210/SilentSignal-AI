import { WellnessTip } from '../types';

export const wellnessTips: WellnessTip[] = [
  // Low risk tips
  { level: 'low', text: "Keep up the balance. Try a 5-minute walk after lunch.", icon: "🚶", category: 'rest' },
  { level: 'low', text: "You're doing great! Consider starting a gratitude journal.", icon: "📔", category: 'mindfulness' },
  { level: 'low', text: "Maintain this momentum. How about a quick stretch break?", icon: "🧘", category: 'rest' },
  { level: 'low', text: "Excellent balance! Try connecting with a colleague today.", icon: "👥", category: 'social' },
  { level: 'low', text: "Perfect rhythm! Block 15 minutes for deep breathing.", icon: "🌬️", category: 'mindfulness' },
  
  // Medium risk tips
  { level: 'medium', text: "You're showing early signals. Try disconnecting 1 hour before bed.", icon: "🌙", category: 'rest' },
  { level: 'medium', text: "Time for a reset. Schedule a 15-minute mindfulness session.", icon: "🧘", category: 'mindfulness' },
  { level: 'medium', text: "Your energy is dipping. Consider taking a proper lunch break.", icon: "🍽️", category: 'rest' },
  { level: 'medium', text: "Early warning signs detected. Try the 2-minute rule for tasks.", icon: "⏰", category: 'productivity' },
  { level: 'medium', text: "Balance is shifting. Block 30 minutes for something you enjoy.", icon: "🎨", category: 'rest' },
  { level: 'medium', text: "Consider a walking meeting instead of sitting.", icon: "🚶", category: 'rest' },
  { level: 'medium', text: "Try the Pomodoro technique: 25 min work, 5 min break.", icon: "🍅", category: 'productivity' },
  
  // High risk tips
  { level: 'high', text: "Your body is asking for rest. Block tomorrow as a recovery day.", icon: "🛌", category: 'rest' },
  { level: 'high', text: "Critical burnout risk. Please speak with your manager about workload.", icon: "💬", category: 'social' },
  { level: 'high', text: "Immediate action needed. Take the rest of today off if possible.", icon: "🚫", category: 'rest' },
  { level: 'high', text: "You're at high risk. Consider professional support this week.", icon: "🏥", category: 'social' },
  { level: 'high', text: "Emergency rest required. Prioritize sleep and disconnect completely.", icon: "💤", category: 'rest' },
  { level: 'high', text: "Set up an emergency wellness call with a trusted friend.", icon: "📞", category: 'social' },
];

export function getRandomTip(level: 'low' | 'medium' | 'high'): WellnessTip {
  const filteredTips = wellnessTips.filter(tip => tip.level === level);
  return filteredTips[Math.floor(Math.random() * filteredTips.length)];
}

export function getTipByCategory(category: 'rest' | 'social' | 'productivity' | 'mindfulness'): WellnessTip[] {
  return wellnessTips.filter(tip => tip.category === category);
}