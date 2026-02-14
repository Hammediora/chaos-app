import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://corporatebs-generator.samerat.com/api/v1/corporate-bs', {
            next: { revalidate: 0 },
        });
        if (!res.ok) throw new Error('Corporate BS API failed');
        const data = await res.json();
        return NextResponse.json({
            id: crypto.randomUUID(),
            type: 'corporate',
            text: data.phrase || data,
            source: 'Corporate BS Generator',
            createdAt: new Date().toISOString(),
        });
    } catch {
        const fallbacks = [
            "We need to synergize our cross-platform deliverables.",
            "Let's leverage our core competencies to drive stakeholder value.",
            "This quarter we're pivoting to a holistic engagement strategy.",
            "We must disrupt the paradigm with innovative thought leadership.",
        ];
        return NextResponse.json({
            id: crypto.randomUUID(),
            type: 'corporate',
            text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
            source: 'Corporate BS (fallback)',
            createdAt: new Date().toISOString(),
        });
    }
}
