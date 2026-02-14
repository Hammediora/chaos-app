'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContentItem } from '@/types';
import { fetchExcuse, fetchBuzz, fetchTechy } from '@/lib/api';
import { ContentCard } from '@/components/ui/ContentCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/ErrorState';

const SITUATIONS = [
  'Late to work',
  'Missed meeting',
  'Forgot deadline',
  'Ghosted someone',
  'Skipped gym',
  'Left on read',
  'Overslept',
  'Forgot birthday',
];

export default function ExcusesPage() {
  const [situation, setSituation] = useState('');
  const [tone, setTone] = useState(50); /* 0=believable, 100=ridiculous */
  const [corporatePolish, setCorporatePolish] = useState(false);
  const [result, setResult] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(false);

    try {
      const excuse = await fetchExcuse();
      let finalText = excuse.text;

      /* If corporate polish is on OR tone is >70, add corporate flavor */
      if (corporatePolish || tone > 70) {
        try {
          const [buzz, techy] = await Promise.all([fetchBuzz(), fetchTechy()]);
          if (tone > 70) {
            finalText = `${excuse.text} ...but in my defense, ${techy.text.toLowerCase()}`;
          }
          if (corporatePolish) {
            finalText = `Per my last email — ${finalText} Furthermore, ${buzz.text.toLowerCase()}.`;
          }
        } catch {
          /* Fine, just use the base excuse */
        }
      }

      /* If tone < 30, make it more "professional" */
      if (tone < 30) {
        finalText = `I sincerely apologize, but ${finalText.charAt(0).toLowerCase() + finalText.slice(1)}`;
      }

      if (situation) {
        finalText = `[Re: ${situation}] ${finalText}`;
      }

      setResult({
        id: crypto.randomUUID(),
        type: 'excuse',
        text: finalText,
        source: excuse.source + (corporatePolish ? ' + Corporate Polish' : ''),
        meta: { situation, tone, corporatePolish },
        createdAt: new Date().toISOString(),
      });
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="heading-display text-3xl md:text-4xl text-parchment mb-2">
          Excuse Generator
        </h1>
        <p className="text-mocha text-sm mb-8">
          Craft the perfect excuse. From believable to absolutely unhinged.
        </p>
      </motion.div>

      {/* ── Controls ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5 mb-6 space-y-5"
      >
        {/* Situation */}
        <div>
          <label className="text-label text-linen block mb-2">Situation</label>
          <div className="flex flex-wrap gap-2">
            {SITUATIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSituation(situation === s ? '' : s)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${situation === s
                    ? 'bg-brass/15 text-brass border border-brass/30'
                    : 'bg-surface text-linen/70 border border-walnut hover:border-mocha hover:text-linen'
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tone slider */}
        <div>
          <label className="text-label text-linen block mb-2">
            Tone: {tone < 30 ? 'Believable' : tone < 70 ? 'Creative' : 'Ridiculous'}
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={tone}
            onChange={(e) => setTone(Number(e.target.value))}
            aria-label="Excuse tone slider"
          />
          <div className="flex justify-between text-[10px] text-mocha mt-1">
            <span>Believable</span>
            <span>Ridiculous</span>
          </div>
        </div>

        {/* Corporate polish toggle */}
        <div className="flex items-center gap-3">
          <button
            role="switch"
            aria-checked={corporatePolish}
            onClick={() => setCorporatePolish(!corporatePolish)}
            className={`
              relative w-11 h-6 rounded-full transition-colors
              ${corporatePolish ? 'bg-brass' : 'bg-walnut'}
            `}
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-parchment shadow-md
                transition-transform duration-200
                ${corporatePolish ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
          <span className="text-sm text-linen">Add corporate polish</span>
        </div>

        <ActionButton onClick={handleGenerate} loading={loading} className="w-full">
          Generate Excuse
        </ActionButton>
      </motion.div>

      {/* ── Result ── */}
      {error && <ErrorState onRetry={handleGenerate} />}
      {loading && !result && <SkeletonCard />}
      {result && !loading && <ContentCard item={result} />}

      {result && !loading && (
        <div className="flex justify-center mt-5">
          <ActionButton onClick={handleGenerate} variant="ghost" size="sm">
            Generate Another
          </ActionButton>
        </div>
      )}
    </div>
  );
}
