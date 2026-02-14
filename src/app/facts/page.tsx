'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '@/types';
import { fetchFact } from '@/lib/api';
import { getFactGameData, recordFactGuess } from '@/lib/streaks';
import { addFavorite } from '@/lib/favorites';
import { ActionButton } from '@/components/ui/ActionButton';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/ErrorState';

export default function FactsPage() {
  const [fact, setFact] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState<'true' | 'cap' | null>(null);
  const [gameData, setGameData] = useState(() => getFactGameData());

  const loadFact = useCallback(async () => {
    setLoading(true);
    setError(false);
    setRevealed(false);
    setGuess(null);

    try {
      const newFact = await fetchFact();
      setFact(newFact);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  const handleGuess = (g: 'true' | 'cap') => {
    setGuess(g);
    setRevealed(true);
    /* All fetched facts from the API are real, so "true" is always correct */
    const isCorrect = g === 'true';
    const updated = recordFactGuess(isCorrect);
    setGameData(updated);
  };

  const handleSave = () => {
    if (fact) addFavorite(fact);
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="heading-display text-3xl md:text-4xl text-parchment mb-2">
          Fact or Cap
        </h1>
        <p className="text-mocha text-sm mb-8">
          Real facts that sound fake. Can you tell the difference?
        </p>
      </motion.div>

      {/* ── Game Stats ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-6 mb-8 p-4 rounded-xl bg-surface-raised border border-walnut/50"
      >
        <div className="text-center">
          <p className="heading-display text-2xl text-brass">{gameData.currentStreak}</p>
          <p className="text-label text-mocha">Streak</p>
        </div>
        <div className="w-px h-10 bg-walnut" />
        <div className="text-center">
          <p className="heading-display text-2xl text-gold-light">{gameData.bestStreak}</p>
          <p className="text-label text-mocha">Best</p>
        </div>
        <div className="w-px h-10 bg-walnut" />
        <div className="text-center">
          <p className="heading-display text-2xl text-linen">
            {gameData.totalPlayed > 0 ? Math.round((gameData.totalCorrect / gameData.totalPlayed) * 100) : 0}%
          </p>
          <p className="text-label text-mocha">Accuracy</p>
        </div>
      </motion.div>

      {/* ── Start / Fact Display ── */}
      {!fact && !loading && !error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-mocha text-sm mb-6">Ready to test your instincts?</p>
          <ActionButton onClick={loadFact} size="lg">
            Show Me a Fact
          </ActionButton>
        </motion.div>
      )}

      {error && <ErrorState onRetry={loadFact} />}
      {loading && <SkeletonCard />}

      {fact && !loading && (
        <AnimatePresence mode="wait">
          <motion.div
            key={fact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="card p-6 mb-6">
              <span className="badge badge-fact mb-4">Fact?</span>
              <p className="text-parchment text-lg leading-relaxed font-serif mb-6">{fact.text}</p>

              {!revealed ? (
                <div className="grid grid-cols-2 gap-3">
                  <ActionButton
                    onClick={() => handleGuess('true')}
                    variant="secondary"
                    size="lg"
                    className="border-vintage-green/40 text-vintage-green hover:bg-vintage-green/10"
                  >
                    True
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleGuess('cap')}
                    variant="secondary"
                    size="lg"
                    className="border-burgundy/40 text-burgundy-light hover:bg-burgundy/10"
                  >
                    Cap
                  </ActionButton>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`
                    p-4 rounded-lg border
                    ${guess === 'true'
                      ? 'bg-vintage-green/10 border-vintage-green/30'
                      : 'bg-burgundy/10 border-burgundy/30'
                    }
                  `}
                >
                  <p className={`font-semibold text-sm mb-1 ${guess === 'true' ? 'text-vintage-green' : 'text-burgundy-light'}`}>
                    {guess === 'true' ? 'Correct! It\'s real.' : 'Wrong! This one is actually true.'}
                  </p>
                  <p className="text-mocha text-xs">
                    {guess === 'true'
                      ? 'Your instincts are solid. Keep that streak going.'
                      : 'The truth really is stranger than fiction. Streak reset.'}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <ActionButton onClick={loadFact} size="sm">
                      Next Fact
                    </ActionButton>
                    <ActionButton onClick={handleSave} variant="ghost" size="sm">
                      Save This
                    </ActionButton>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
