import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://www.yomama-jokes.com/api/v1/jokes/random/', {
            next: { revalidate: 0 },
        });
        if (!res.ok) throw new Error('Yo Momma API failed');
        const data = await res.json();
        return NextResponse.json({
            id: crypto.randomUUID(),
            type: 'joke',
            text: data.joke,
            source: 'Yo Momma API',
            createdAt: new Date().toISOString(),
        });
    } catch {
        /* Fallback: return a hardcoded selection if API is down */
        const fallbacks = [
            "Yo momma so slow, she took 2 hours to watch 60 Minutes.",
            "Yo momma so old, her birth certificate says 'expired'.",
            "Yo momma so tall, she tripped over a rock and hit her head on the moon.",
            "Yo momma so forgetful, she thought a quarterback was a refund.",
        ];
        return NextResponse.json({
            id: crypto.randomUUID(),
            type: 'joke',
            text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
            source: 'Yo Momma (fallback)',
            createdAt: new Date().toISOString(),
        });
    }
}
