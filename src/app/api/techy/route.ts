import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://techy-api.vercel.app/api/json', {
            next: { revalidate: 0 },
        });
        if (!res.ok) throw new Error('Techy API failed');
        const data = await res.json();
        return NextResponse.json({
            id: crypto.randomUUID(),
            type: 'corporate',
            text: data.message || data,
            source: 'Techy API',
            createdAt: new Date().toISOString(),
        });
    } catch {
        const fallbacks = [
            "Have you tried mass-producing the debatable tech stack?",
            "We should Kubernetes the blockchain microservice.",
            "Let's containerize the AI-powered machine learning pipeline.",
        ];
        return NextResponse.json({
            id: crypto.randomUUID(),
            type: 'corporate',
            text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
            source: 'Techy (fallback)',
            createdAt: new Date().toISOString(),
        });
    }
}
