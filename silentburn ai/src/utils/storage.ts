import { JournalEntry, Achievement } from '../types';

const STORAGE_KEY = 'burnout-journal-entries';
const ACHIEVEMENTS_KEY = 'burnout-achievements';
const SETTINGS_KEY = 'burnout-settings';

export function saveEntry(entry: JournalEntry): void {
  const existingEntries = getEntries();
  const updatedEntries = [entry, ...existingEntries].slice(0, 90); // Keep last 90 entries
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  checkAndUnlockAchievements(updatedEntries);
}

export function getEntries(): JournalEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getTodayEntry(): JournalEntry | undefined {
  const entries = getEntries();
  const today = new Date().toDateString();
  return entries.find(entry => new Date(entry.date).toDateString() === today);
}

export function getStreak(): number {
  const entries = getEntries();
  if (entries.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < entries.length; i++) {
    const entryDate = new Date(entries[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (entryDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function getAchievements(): Achievement[] {
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
  const defaultAchievements: Achievement[] = [
    {
      id: 'first_entry',
      title: 'First Step',
      description: 'Complete your first journal entry',
      icon: '🌱',
      unlocked: false
    },
    {
      id: 'week_streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: false
    },
    {
      id: 'month_streak',
      title: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      unlocked: false
    },
    {
      id: 'balanced',
      title: 'Balance Champion',
      description: 'Have 5 consecutive low-risk days',
      icon: '⚖️',
      unlocked: false
    },
    {
      id: 'insightful',
      title: 'Self-Aware',
      description: 'Generate 10 insights',
      icon: '💡',
      unlocked: false
    }
  ];
  
  return stored ? JSON.parse(stored) : defaultAchievements;
}

function checkAndUnlockAchievements(entries: JournalEntry[]): void {
  const achievements = getAchievements();
  let updated = false;
  
  // First entry
  if (entries.length >= 1 && !achievements[0].unlocked) {
    achievements[0].unlocked = true;
    achievements[0].unlockedAt = new Date().toISOString();
    updated = true;
  }
  
  // Week streak
  const streak = getStreak();
  if (streak >= 7 && !achievements[1].unlocked) {
    achievements[1].unlocked = true;
    achievements[1].unlockedAt = new Date().toISOString();
    updated = true;
  }
  
  // Month streak
  if (streak >= 30 && !achievements[2].unlocked) {
    achievements[2].unlocked = true;
    achievements[2].unlockedAt = new Date().toISOString();
    updated = true;
  }
  
  // Balance champion
  const recentLowRisk = entries.slice(0, 5).filter(e => e.riskLevel === 'low').length;
  if (recentLowRisk >= 5 && !achievements[3].unlocked) {
    achievements[3].unlocked = true;
    achievements[3].unlockedAt = new Date().toISOString();
    updated = true;
  }
  
  if (updated) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
}

export function exportData(): string {
  const entries = getEntries();
  const achievements = getAchievements();
  const exportData = {
    entries,
    achievements,
    exportDate: new Date().toISOString()
  };
  
  return JSON.stringify(exportData, null, 2);
}