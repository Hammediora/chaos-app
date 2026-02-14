import { StreakData, FactGameData } from '@/types';

const STREAK_KEY = 'chaoshub_streak';
const FACT_GAME_KEY = 'chaoshub_factgame';

function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

/* ── Visit Streak ── */

export function getStreakData(): StreakData {
    if (typeof window === 'undefined') {
        return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0, dailyChallengeCompletedToday: false };
    }
    try {
        const data = localStorage.getItem(STREAK_KEY);
        return data ? JSON.parse(data) : { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0, dailyChallengeCompletedToday: false };
    } catch {
        return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0, dailyChallengeCompletedToday: false };
    }
}

export function recordVisit(): StreakData {
    const today = getToday();
    const yesterday = getYesterday();
    const data = getStreakData();

    if (data.lastVisit === today) return data; /* Already visited today */

    const isConsecutive = data.lastVisit === yesterday;
    const newStreak = isConsecutive ? data.currentStreak + 1 : 1;

    const updated: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(data.longestStreak, newStreak),
        lastVisit: today,
        totalVisits: data.totalVisits + 1,
        dailyChallengeCompletedToday: false,
    };

    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return updated;
}

export function completeDailyChallenge(): void {
    const data = getStreakData();
    data.dailyChallengeCompletedToday = true;
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

/* ── Fact Game ── */

export function getFactGameData(): FactGameData {
    if (typeof window === 'undefined') {
        return { currentStreak: 0, bestStreak: 0, totalPlayed: 0, totalCorrect: 0 };
    }
    try {
        const data = localStorage.getItem(FACT_GAME_KEY);
        return data ? JSON.parse(data) : { currentStreak: 0, bestStreak: 0, totalPlayed: 0, totalCorrect: 0 };
    } catch {
        return { currentStreak: 0, bestStreak: 0, totalPlayed: 0, totalCorrect: 0 };
    }
}

export function recordFactGuess(correct: boolean): FactGameData {
    const data = getFactGameData();
    const newStreak = correct ? data.currentStreak + 1 : 0;

    const updated: FactGameData = {
        currentStreak: newStreak,
        bestStreak: Math.max(data.bestStreak, newStreak),
        totalPlayed: data.totalPlayed + 1,
        totalCorrect: data.totalCorrect + (correct ? 1 : 0),
    };

    localStorage.setItem(FACT_GAME_KEY, JSON.stringify(updated));
    return updated;
}
