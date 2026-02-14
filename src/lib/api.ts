import { ContentItem } from '@/types';

const API_TIMEOUT = 8000;

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res;
    } finally {
        clearTimeout(timeout);
    }
}

export async function fetchChuckNorrisJoke(): Promise<ContentItem> {
    const res = await fetchWithTimeout('/api/jokes/chucknorris');
    return res.json();
}

export async function fetchYoMommaJoke(): Promise<ContentItem> {
    const res = await fetchWithTimeout('/api/jokes/yomomma');
    return res.json();
}

export async function fetchRandomJoke(): Promise<ContentItem> {
    return Math.random() > 0.5 ? fetchChuckNorrisJoke() : fetchYoMommaJoke();
}

export async function fetchExcuse(): Promise<ContentItem> {
    const res = await fetchWithTimeout('/api/excuse');
    return res.json();
}

export async function fetchBuzz(): Promise<ContentItem> {
    const res = await fetchWithTimeout('/api/buzz');
    return res.json();
}

export async function fetchTechy(): Promise<ContentItem> {
    const res = await fetchWithTimeout('/api/techy');
    return res.json();
}

export async function fetchCorporateLine(): Promise<ContentItem> {
    const [buzz, techy] = await Promise.all([fetchBuzz(), fetchTechy()]);
    return {
        id: crypto.randomUUID(),
        type: 'corporate',
        text: `${buzz.text} — ${techy.text}`,
        source: 'Corporate BS + Techy',
        createdAt: new Date().toISOString(),
    };
}

export async function fetchFact(): Promise<ContentItem> {
    const res = await fetchWithTimeout('/api/facts');
    return res.json();
}

export async function fetchMemeTemplates() {
    const res = await fetchWithTimeout('/api/memes/templates');
    return res.json();
}

export async function createMeme(templateId: string, topText: string, bottomText: string) {
    const res = await fetchWithTimeout('/api/memes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, topText, bottomText }),
    });
    return res.json();
}
