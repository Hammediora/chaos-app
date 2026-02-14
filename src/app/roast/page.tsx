'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContentItem } from '@/types';
import { ContentCard } from '@/components/ui/ContentCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/ErrorState';
import { Disclaimer } from '@/components/ui/Disclaimer';

const INTENSITIES = [
  { id: 'mild', label: 'Mild', desc: 'A gentle nudge' },
  { id: 'medium', label: 'Medium', desc: 'Getting warm' },
  { id: 'nuclear', label: 'Nuclear', desc: 'No survivors' },
];

export default function RoastPage() {
  const [target, setTarget] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: target.trim(),
          intensity,
          previousStarts: results.map((r) => r.text.slice(0, 40)),
        }),
      });

      if (!res.ok) throw new Error('Roast generation failed');
      const roast: ContentItem = await res.json();

      /* Prepend new roast to history */
      setResults((prev) => [roast, ...prev].slice(0, 10));
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="heading-display text-3xl md:text-4xl text-parchment mb-2">
          Roast Zone
        </h1>
        <p className="text-mocha text-sm mb-4">
          Enter the danger zone. Roasts served fresh, damage not our responsibility.
        </p>
        <Disclaimer className="mb-8" />
      </motion.div>

      {/* ── Controls ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5 mb-6 space-y-5"
      >
        {/* Target */}
        <div>
          <label htmlFor="roast-target" className="text-label text-linen block mb-2">Target Name / Role</label>
          <input
            id="roast-target"
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g. Dave from Accounting"
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-walnut text-parchment text-sm placeholder:text-mocha/60 focus:border-brass focus:outline-none transition-colors"
          />
          <p className="text-mocha/50 text-[11px] mt-1.5 italic">💡 Want it spicy? Drop in the name of your enemy, coworker, or ex.</p>
        </div>

        {/* Intensity */}
        <div>
          <p className="text-label text-linen mb-2">Intensity</p>
          <div className="grid grid-cols-3 gap-2">
            {INTENSITIES.map((i) => (
              <button
                key={i.id}
                onClick={() => setIntensity(i.id)}
                className={`
                  p-3 rounded-lg text-center transition-colors border
                  ${intensity === i.id
                    ? i.id === 'nuclear'
                      ? 'bg-burgundy/15 border-burgundy/30 text-burgundy-light'
                      : 'bg-brass/10 border-brass/30 text-brass'
                    : 'bg-surface border-walnut text-linen/70 hover:border-mocha'
                  }
                `}
              >
                <p className="text-sm font-medium">{i.label}</p>
                <p className="text-[10px] mt-0.5 opacity-70">{i.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <ActionButton onClick={handleGenerate} loading={loading} className="w-full">
          Generate Roast
        </ActionButton>
      </motion.div>

      {/* ── Results ── */}
      {error && <ErrorState message="The roast machine broke. Even it gave up." onRetry={handleGenerate} />}
      {loading && results.length === 0 && <SkeletonCard />}

      <div className="space-y-4">
        {results.map((roast, i) => (
          <motion.div
            key={roast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i === 0 ? 0 : 0.05 }}
          >
            {i === 0 && (
              <p className="text-label text-brass mb-2">Latest Roast</p>
            )}
            {i === 1 && results.length > 1 && (
              <p className="text-label text-mocha mb-2 mt-6">Previous Roasts</p>
            )}
            <ContentCard item={roast} />
          </motion.div>
        ))}
      </div>

      {results.length > 0 && !loading && (
        <div className="flex justify-center mt-6">
          <ActionButton onClick={handleGenerate} variant="ghost" size="sm">
            Roast Again
          </ActionButton>
        </div>
      )}
    </div>
  );
}
