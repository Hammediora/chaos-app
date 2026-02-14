import { NextResponse } from 'next/server';

/**
 * Dedicated roast generator that creates varied, personalized roasts
 * by combining multiple API sources with creative templates.
 */

/* ── Grammar helpers for "you" vs named targets ── */
const isYou = (t: string) => t.toLowerCase() === 'you';
const poss = (t: string) => isYou(t) ? 'your' : `${t}'s`;          // your / Jeff's
const isAre = (t: string) => isYou(t) ? "you're" : `${t} is`;      // you're / Jeff is
const wasWere = (t: string) => isYou(t) ? 'you were' : `${t} was`; // you were / Jeff was
const hasHave = (t: string) => isYou(t) ? "you've" : `${t} has`;   // you've / Jeff has
const doesDo = (t: string) => isYou(t) ? 'you' : `${t}`;           // you put / Jeff puts

/* ── Roast templates organized by intensity ── */
const MILD_TEMPLATES = [
    (t: string, joke: string) => `${isAre(t)} the kind of person who ${joke.toLowerCase()}`,
    (t: string, _j: string, fact: string) => `Fun fact about ${doesDo(t)}: ${fact} ...actually, that's more interesting than anything ${doesDo(t)} ${isYou(t) ? 'have' : 'has'} ever done.`,
    (t: string, joke: string) => `I'm not saying ${isAre(t)} bad at ${poss(t)} job, but ${joke.toLowerCase()}`,
    (t: string, _j: string, _f: string, buzz: string) => `${poss(t)} entire personality is just "${buzz}" — and somehow ${isYou(t) ? "you're" : "they're"} still boring.`,
    (t: string, joke: string) => `${doesDo(t)} walked into a room and even the WiFi disconnected. ${joke}`,
    (t: string, _j: string, _f: string, buzz: string) => `${doesDo(t)} ${isYou(t) ? 'put' : 'puts'} "${buzz}" on ${poss(t)} resume and ${isYou(t) ? 'call' : 'calls'} it a skill.`,
    (t: string, joke: string) => `If ${doesDo(t)} ${wasWere(t).split(' ')[1]} a spice, ${isYou(t) ? "you'd" : "they'd"} be flour. ${joke}`,
    (t: string, _j: string, fact: string) => `${isAre(t)} living proof that ${fact.toLowerCase()} ...wait, no, that's actually useful unlike ${doesDo(t)}.`,
];

const MEDIUM_TEMPLATES = [
    (t: string, joke: string) => `${isAre(t)} so unremarkable that ${joke.toLowerCase()} ...and nobody noticed.`,
    (t: string, _j: string, fact: string, buzz: string) => `They say ${fact.toLowerCase()} Meanwhile, ${isAre(t)} out here trying to "${buzz.toLowerCase()}" and failing spectacularly.`,
    (t: string, joke: string, _f: string, buzz: string) => `${poss(t)} LinkedIn says "${buzz}" but in reality, ${joke.toLowerCase()}`,
    (t: string, joke: string) => `Last time ${doesDo(t)} had an original thought, ${joke.toLowerCase()}`,
    (t: string, _j: string, fact: string) => `Even though ${fact.toLowerCase()}, ${doesDo(t)} still can't figure out how to reply-all correctly.`,
    (t: string, joke: string, _f: string, buzz: string) => `${doesDo(t)} ${isYou(t) ? 'describe yourself' : 'describes themselves'} as someone who can "${buzz.toLowerCase()}" — the rest of us ${isYou(t) ? 'describe you' : `describe ${t}`} as someone who ${joke.toLowerCase()}`,
    (t: string, joke: string) => `I'd tell ${doesDo(t)} to go outside, but even the sun would be disappointed. ${joke}`,
    (t: string, _j: string, _f: string, buzz: string) => `${doesDo(t)} once said "${buzz}" in a meeting and everyone just stared. That was the highlight of ${poss(t)} career.`,
];

const NUCLEAR_TEMPLATES = [
    (t: string, joke: string, fact: string) => `Listen, I want ${doesDo(t)} to know something: ${fact.toLowerCase()} And somehow that's STILL more useful information than anything ${isYou(t) ? "you've" : `${t} has`} contributed this quarter. ${joke}`,
    (t: string, joke: string, _f: string, buzz: string) => `${isAre(t)} what happens when you "${buzz.toLowerCase()}" but forget to include talent anywhere in the pipeline. ${joke} ...and honestly, that's the nicest thing anyone has said about ${doesDo(t)} all week.`,
    (t: string, joke: string, fact: string) => `Scientists discovered that ${fact.toLowerCase()} They also discovered that ${hasHave(t)} contributed absolutely nothing to society. ${joke} And the worst part? ${doesDo(t)} actually ${isYou(t) ? 'agree' : 'agrees'}.`,
    (t: string, _j: string, fact: string, buzz: string) => `${poss(t)} entire career can be summarized as: "${buzz}" — which, translated from corporate to English, means "I have no idea what I'm doing." Did you know that ${fact.toLowerCase()} That fact has more depth than ${poss(t)} personality.`,
    (t: string, joke: string, _f: string, buzz: string) => `Calling ${doesDo(t)} a disappointment would be a compliment — at least a disappointment implies someone had expectations. ${joke} ${poss(t)} crowning achievement? Getting a promotion by claiming ${isYou(t) ? 'you' : 'they'} could "${buzz.toLowerCase()}" ...${isYou(t) ? 'you' : 'they'} could not.`,
    (t: string, joke: string, fact: string) => `I've seen smarter decisions from a magic 8-ball. Did ${doesDo(t)} know ${fact.toLowerCase()} That random fact just taught ${doesDo(t)} more than ${poss(t)} entire education. ${joke} — and honestly, that's still a better career path than whatever ${isAre(t)} doing.`,
];

async function fetchSource(url: string, timeout = 5000): Promise<string | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
        if (!res.ok) return null;
        return JSON.stringify(await res.json());
    } catch {
        return null;
    } finally {
        clearTimeout(timer);
    }
}

export async function POST(request: Request) {
    try {
        const { target, intensity, previousStarts = [] } = await request.json();
        const targetName = (target || 'you').trim();
        const prevSet: string[] = previousStarts.map((s: string) => s.toLowerCase());

        /* Fetch multiple sources in parallel for variety */
        const [chuckRaw, yomommaRaw, factRaw, buzzRaw, techyRaw] = await Promise.allSettled([
            fetchSource('https://api.chucknorris.io/jokes/random'),
            fetchSource('https://www.yomama-jokes.com/api/v1/jokes/random/'),
            fetchSource('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en'),
            fetchSource('https://corporatebs-generator.samerat.com/api/v1/corporate-bs'),
            fetchSource('https://techy-api.vercel.app/api/json'),
        ]);

        /* Parse results with fallbacks */
        let joke = 'they peaked in middle school';
        let fact = "A group of flamingos is called a 'flamboyance'";
        let buzz = 'synergize cross-platform deliverables';

        if (chuckRaw.status === 'fulfilled' && chuckRaw.value) {
            try {
                const parsed = JSON.parse(chuckRaw.value);
                const j = parsed.value || '';
                /* Replace Chuck Norris references with target-appropriate phrasing */
                joke = j
                    .replace(/Chuck Norris('s)?/gi, (_m: string, pos: string | undefined) => {
                        return pos ? poss(targetName) : doesDo(targetName);
                    })
                    .replace(/\bChuck\b/g, doesDo(targetName))
                    .replace(/\bNorris\b/g, '')
                    .replace(/\bHe\b/g, isYou(targetName) ? 'You' : 'He')
                    .replace(/\bhe\b/g, isYou(targetName) ? 'you' : 'he')
                    .replace(/\bhis\b/g, isYou(targetName) ? 'your' : 'his')
                    .replace(/\bHis\b/g, isYou(targetName) ? 'Your' : 'His')
                    .replace(/\bhim\b/g, isYou(targetName) ? 'you' : 'him')
                    .replace(/\s{2,}/g, ' ')
                    .trim();
            } catch { /* use fallback */ }
        }

        /* Sometimes use yomomma instead for variety */
        if (Math.random() > 0.5 && yomommaRaw.status === 'fulfilled' && yomommaRaw.value) {
            try {
                const parsed = JSON.parse(yomommaRaw.value);
                if (parsed.joke) {
                    joke = parsed.joke
                        .replace(/yo momma('s)?/gi, (_m: string, pos: string | undefined) => pos ? poss(targetName) : doesDo(targetName))
                        .replace(/your mom('s)?/gi, (_m: string, pos: string | undefined) => pos ? poss(targetName) : doesDo(targetName))
                        .replace(/yo mama('s)?/gi, (_m: string, pos: string | undefined) => pos ? poss(targetName) : doesDo(targetName));
                }
            } catch { /* use previous joke */ }
        }

        if (factRaw.status === 'fulfilled' && factRaw.value) {
            try {
                const parsed = JSON.parse(factRaw.value);
                fact = parsed.text || fact;
            } catch { /* use fallback */ }
        }

        if (buzzRaw.status === 'fulfilled' && buzzRaw.value) {
            try {
                const parsed = JSON.parse(buzzRaw.value);
                buzz = parsed.phrase || parsed || buzz;
            } catch { /* use fallback */ }
        }

        if (techyRaw.status === 'fulfilled' && techyRaw.value) {
            try {
                const parsed = JSON.parse(techyRaw.value);
                if (parsed.message && Math.random() > 0.5) {
                    buzz = parsed.message;
                }
            } catch { /* use previous buzz */ }
        }

        /* Pick template based on intensity */
        let templates: Array<(t: string, j: string, f: string, b: string) => string>;
        switch (intensity) {
            case 'mild':
                templates = MILD_TEMPLATES;
                break;
            case 'nuclear':
                templates = NUCLEAR_TEMPLATES;
                break;
            default:
                templates = MEDIUM_TEMPLATES;
        }

        /* Try up to 5 times to avoid repeating a template the user already saw */
        let roastText = '';
        const shuffled = [...templates].sort(() => Math.random() - 0.5);
        for (let attempt = 0; attempt < Math.min(shuffled.length, 5); attempt++) {
            const candidate = shuffled[attempt](targetName, joke, fact, buzz);
            const candidateStart = candidate.slice(0, 40).toLowerCase();
            const isDuplicate = prevSet.some((p: string) => candidateStart === p);
            roastText = candidate;
            if (!isDuplicate) break;
        }

        return NextResponse.json({
            id: crypto.randomUUID(),
            type: 'roast',
            text: roastText,
            source: `Roast Zone (${intensity || 'medium'})`,
            meta: { target: targetName, intensity },
            createdAt: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json(
            { error: 'The roast machine broke. Even it gave up.' },
            { status: 502 },
        );
    }
}
