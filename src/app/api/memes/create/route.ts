import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { templateId, topText, bottomText } = await request.json();

        if (!templateId) {
            return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
        }

        const username = process.env.IMGFLIP_USERNAME;
        const password = process.env.IMGFLIP_PASSWORD;

        /* If no credentials, return a preview-only response */
        if (!username || !password) {
            return NextResponse.json({
                success: false,
                previewOnly: true,
                message: 'Imgflip credentials not configured. Use the client-side canvas preview.',
                templateId,
                topText,
                bottomText,
            });
        }

        const params = new URLSearchParams({
            template_id: templateId,
            username,
            password,
            text0: topText || '',
            text1: bottomText || '',
        });

        const res = await fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: params,
        });

        if (!res.ok) throw new Error('Imgflip caption API failed');
        const data = await res.json();

        if (!data.success) {
            return NextResponse.json({ error: data.error_message || 'Meme creation failed' }, { status: 502 });
        }

        return NextResponse.json({
            success: true,
            url: data.data.url,
            pageUrl: data.data.page_url,
        });
    } catch {
        return NextResponse.json(
            { error: 'Failed to create meme' },
            { status: 502 }
        );
    }
}
