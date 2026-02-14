import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://excuser-three.vercel.app/v1/excuse', {
            next: { revalidate: 0 },
        });
        if (!res.ok) throw new Error('Excuse API failed');
        const data = await res.json();
        const excuse = Array.isArray(data) ? data[0] : data;
        return NextResponse.json({
            id: String(excuse.id || crypto.randomUUID()),
            type: 'excuse',
            text: excuse.excuse,
            source: 'Excuser API',
            meta: { category: excuse.category },
            createdAt: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch excuse' },
            { status: 502 }
        );
    }
}
