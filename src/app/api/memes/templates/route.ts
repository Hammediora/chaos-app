import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://api.imgflip.com/get_memes', {
            next: { revalidate: 3600 }, /* Cache for 1 hour */
        });
        if (!res.ok) throw new Error('Imgflip API failed');
        const data = await res.json();

        if (!data.success) throw new Error('Imgflip returned unsuccessful');

        const templates = data.data.memes.slice(0, 50).map((meme: Record<string, unknown>) => ({
            id: meme.id,
            name: meme.name,
            url: meme.url,
            width: meme.width,
            height: meme.height,
            boxCount: meme.box_count,
        }));

        return NextResponse.json({ templates });
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch meme templates' },
            { status: 502 }
        );
    }
}
