import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en', {
            next: { revalidate: 0 },
        });
        if (!res.ok) throw new Error('Useless Facts API failed');
        const data = await res.json();
        return NextResponse.json({
            id: data.id || crypto.randomUUID(),
            type: 'fact',
            text: data.text,
            source: 'Useless Facts',
            meta: { permalink: data.permalink },
            createdAt: new Date().toISOString(),
        });
    } catch {
        /* Fallback: fun facts */
        const fallbacks = [
            { text: "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.", id: "f1" },
            { text: "A group of flamingos is called a 'flamboyance'.", id: "f2" },
            { text: "The inventor of the Pringles can is buried in one.", id: "f3" },
            { text: "Octopuses have three hearts and blue blood.", id: "f4" },
            { text: "Bananas are berries, but strawberries aren't.", id: "f5" },
        ];
        const fact = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return NextResponse.json({
            id: fact.id,
            type: 'fact',
            text: fact.text,
            source: 'Fun Facts (fallback)',
            createdAt: new Date().toISOString(),
        });
    }
}
