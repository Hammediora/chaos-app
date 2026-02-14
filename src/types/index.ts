export type ContentType = 'joke' | 'excuse' | 'roast' | 'fact' | 'meme' | 'corporate';

export interface ContentItem {
  id: string;
  type: ContentType;
  text: string;
  source: string;
  meta?: Record<string, unknown>;
  imageUrl?: string;
  createdAt: string;
}

export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  boxCount: number;
}

export interface DailyChallenge {
  prompt: string;
  type: ContentType;
  date: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string;
  totalVisits: number;
  dailyChallengeCompletedToday: boolean;
}

export interface FactGameData {
  currentStreak: number;
  bestStreak: number;
  totalPlayed: number;
  totalCorrect: number;
}
