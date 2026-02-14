import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://api.chucknorris.io/jokes/random', {
            next: { revalidate: 0 },
        });
        if (!res.ok) throw new Error('Chuck Norris API failed');
        const data = await res.json();
        return NextResponse.json({
            id: data.id,
            type: 'joke',
            text: data.value,
            source: 'Chuck Norris API',
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch Chuck Norris joke' },
            { status: 502 }
        );
    }
}
