import { ContentItem } from '@/types';

const STORAGE_KEY = 'chaoshub_favorites';

export function getFavorites(): ContentItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function addFavorite(item: ContentItem): void {
    const favorites = getFavorites();
    /* Avoid duplicates by id */
    if (favorites.some((f) => f.id === item.id)) return;
    favorites.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function removeFavorite(id: string): void {
    const favorites = getFavorites().filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(id: string): boolean {
    return getFavorites().some((f) => f.id === id);
}

export function clearAllFavorites(): void {
    localStorage.removeItem(STORAGE_KEY);
}
