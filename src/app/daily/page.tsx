'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '@/types';
import { fetchRandomJoke, fetchCorporateLine, fetchExcuse, fetchFact } from '@/lib/api';
import { getDailyChallenge, getDailyCache, setDailyCache } from '@/lib/daily';
import { recordVisit, getStreakData, completeDailyChallenge } from '@/lib/streaks';
import { ContentCard } from '@/components/ui/ContentCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/ErrorState';

interface DailySet {
  joke: ContentItem | null;
  corporate: ContentItem | null;
  excuse: ContentItem | null;
  fact: ContentItem | null;
}

export default function DailyPage() {
  const [dailySet, setDailySet] = useState<DailySet>({ joke: null, corporate: null, excuse: null, fact: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, totalVisits: 0 });
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const challenge = getDailyChallenge();

  const fetchDailySet = useCallback(async (useCache = true) => {
    if (useCache) {
      const cached = getDailyCache();
      if (cached) {
        setDailySet(cached as unknown as DailySet);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(false);

    try {
      const [joke, corporate, excuse, fact] = await Promise.allSettled([
        fetchRandomJoke(),
        fetchCorporateLine(),
        fetchExcuse(),
        fetchFact(),
      ]);

      const set: DailySet = {
        joke: joke.status === 'fulfilled' ? joke.value : null,
        corporate: corporate.status === 'fulfilled' ? corporate.value : null,
        excuse: excuse.status === 'fulfilled' ? excuse.value : null,
        fact: fact.status === 'fulfilled' ? fact.value : null,
      };

      setDailySet(set);
      if (useCache) setDailyCache(set as unknown as Record<string, unknown>);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const streakData = recordVisit();
    setStreak(streakData);
    setChallengeCompleted(streakData.dailyChallengeCompletedToday);
    fetchDailySet();
  }, [fetchDailySet]);

  const handleSpinAgain = () => fetchDailySet(false);

  const handleCompleteChallenge = () => {
    completeDailyChallenge();
    setChallengeCompleted(true);
  };

  const cards = [
    { key: 'joke', label: 'Joke of the Day', item: dailySet.joke },
    { key: 'corporate', label: 'Corporate Nonsense', item: dailySet.corporate },
    { key: 'excuse', label: 'Excuse of the Day', item: dailySet.excuse },
    { key: 'fact', label: 'Fact of the Day', item: dailySet.fact },
  ];

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="heading-display text-3xl md:text-4xl text-parchment mb-2">
          Daily Chaos
        </h1>
        <p className="text-mocha text-sm">
          Your daily dose of curated nonsense. Fresh chaos, served warm.
        </p>
      </motion.div>

      {/* ── Streak Bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-6 mb-8 p-4 rounded-xl bg-surface-raised border border-walnut/50"
      >
        <div className="text-center">
          <p className="heading-display text-2xl text-brass">{streak.currentStreak}</p>
          <p className="text-label text-mocha">Day Streak</p>
        </div>
        <div className="w-px h-10 bg-walnut" />
        <div className="text-center">
          <p className="heading-display text-2xl text-gold-light">{streak.longestStreak}</p>
          <p className="text-label text-mocha">Best</p>
        </div>
        <div className="w-px h-10 bg-walnut" />
        <div className="text-center">
          <p className="heading-display text-2xl text-linen">{streak.totalVisits}</p>
          <p className="text-label text-mocha">Visits</p>
        </div>
      </motion.div>

      {/* ── Daily Challenge ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8 p-5 rounded-xl bg-brass/5 border border-brass/20"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-label text-brass mb-1">Daily Challenge</p>
            <p className="text-parchment text-sm font-medium">{challenge.prompt}</p>
          </div>
          {challengeCompleted && (
            <span className="badge badge-joke">Done</span>
          )}
        </div>
        {!challengeCompleted && (
          <ActionButton
            variant="secondary"
            size="sm"
            onClick={handleCompleteChallenge}
            className="mt-2"
          >
            Mark Complete
          </ActionButton>
        )}
      </motion.div>

      {/* ── Content Cards ── */}
      {error ? (
        <ErrorState onRetry={() => fetchDailySet(false)} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <AnimatePresence mode="wait">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={`skel-${i}`} />
                  ))
                : cards.map(({ key, label, item }) =>
                    item ? (
                      <div key={key}>
                        <p className="text-label text-mocha mb-2">{label}</p>
                        <ContentCard item={item} />
                      </div>
                    ) : null
                  )
              }
            </AnimatePresence>
          </div>

          <div className="flex justify-center">
            <ActionButton
              onClick={handleSpinAgain}
              loading={loading}
              variant="primary"
              size="lg"
            >
              Spin Again
            </ActionButton>
          </div>
        </>
      )}
    </div>
  );
}
