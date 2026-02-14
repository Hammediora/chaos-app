import { DailyChallenge, ContentType } from '@/types';

const DAILY_CACHE_KEY = 'chaoshub_daily_cache';

/**
 * Generate a deterministic seed from a date string.
 */
function dateSeed(dateStr: string): number {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return Math.abs(hash);
}

/**
 * Get the current daily seed string (YYYY-MM-DD).
 */
export function getDailySeed(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Generate today's daily challenge.
 */
export function getDailyChallenge(): DailyChallenge {
    const date = getDailySeed();
    const seed = dateSeed(date);

    const challenges: Array<{ prompt: string; type: ContentType }> = [
        { prompt: 'Generate the most absurd excuse for being late to a meeting', type: 'excuse' },
        { prompt: 'Create a roast so devastating it should come with a warning label', type: 'roast' },
        { prompt: 'Find a fact so wild it sounds completely made up', type: 'fact' },
        { prompt: 'Generate a corporate buzzword sentence that means absolutely nothing', type: 'corporate' },
        { prompt: 'Create the ultimate meme that captures Monday energy', type: 'meme' },
        { prompt: 'Find a joke that would make even a robot laugh', type: 'joke' },
        { prompt: 'Generate an excuse so creative your boss would actually believe it', type: 'excuse' },
        { prompt: 'Create a roast that starts as a compliment', type: 'roast' },
        { prompt: 'Find a fact that nobody asked for but everyone needs', type: 'fact' },
        { prompt: 'Generate a corporate sentence that could be either genius or nonsense', type: 'corporate' },
        { prompt: 'Create a meme that perfectly describes working from home', type: 'meme' },
        { prompt: 'Find the most unhinged joke the internet has to offer', type: 'joke' },
        { prompt: 'Generate a meeting excuse that involves at least one animal', type: 'excuse' },
        { prompt: 'Create a roast worthy of a black-tie event', type: 'roast' },
    ];

    const index = seed % challenges.length;
    return { ...challenges[index], date };
}

/**
 * Check if daily content was cached for today.
 */
export function getDailyCache(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(DAILY_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed.date !== getDailySeed()) return null;
        return parsed.data;
    } catch {
        return null;
    }
}

/**
 * Cache daily content.
 */
export function setDailyCache(data: Record<string, unknown>): void {
    localStorage.setItem(DAILY_CACHE_KEY, JSON.stringify({
        date: getDailySeed(),
        data,
    }));
}
