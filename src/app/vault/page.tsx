'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem, ContentType } from '@/types';
import { getFavorites, removeFavorite, clearAllFavorites } from '@/lib/favorites';
import { copyToClipboard } from '@/lib/export';
import { ActionButton } from '@/components/ui/ActionButton';

const TYPE_FILTERS: Array<{ id: ContentType | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'joke', label: 'Jokes' },
  { id: 'excuse', label: 'Excuses' },
  { id: 'roast', label: 'Roasts' },
  { id: 'fact', label: 'Facts' },
  { id: 'meme', label: 'Memes' },
  { id: 'corporate', label: 'Corporate' },
];

const BADGE_CLASS: Record<string, string> = {
  joke: 'badge-joke',
  excuse: 'badge-excuse',
  roast: 'badge-roast',
  fact: 'badge-fact',
  meme: 'badge-meme',
  corporate: 'badge-corporate',
};

export default function VaultPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [filter, setFilter] = useState<ContentType | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setItems(getFavorites());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);

  const handleDelete = (id: string) => {
    removeFavorite(id);
    refresh();
  };

  const handleCopy = async (item: ContentItem) => {
    await copyToClipboard(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear the entire vault? This cannot be undone.')) {
      clearAllFavorites();
      refresh();
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-2">
          <h1 className="heading-display text-3xl md:text-4xl text-parchment">The Vault</h1>
          {items.length > 0 && (
            <ActionButton onClick={handleClearAll} variant="ghost" size="sm" className="text-burgundy-light hover:text-burgundy-light">
              Clear All
            </ActionButton>
          )}
        </div>
        <p className="text-mocha text-sm mb-8">
          Your curated collection of chaos. {items.length} item{items.length !== 1 ? 's' : ''} saved.
        </p>
      </motion.div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border
              ${filter === f.id
                ? 'bg-brass/10 text-brass border-brass/30'
                : 'bg-surface text-linen/60 border-walnut hover:border-mocha hover:text-linen'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Items ── */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-4xl font-serif text-walnut mb-4">~</div>
          <p className="text-mocha text-sm mb-2">
            {items.length === 0
              ? 'Nothing saved yet. Go generate some chaos first.'
              : 'No items match this filter.'}
          </p>
          {items.length === 0 && (
            <ActionButton onClick={() => window.location.href = '/daily'} variant="secondary" size="sm" className="mt-4">
              Start Generating
            </ActionButton>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.03 }}
                className="card p-4"
              >
                <div className="flex items-start gap-3">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`badge ${BADGE_CLASS[item.type] || 'badge-joke'}`}>{item.type}</span>
                      <span className="text-[10px] text-mocha">{item.source}</span>
                    </div>
                    <p className="text-parchment text-sm leading-relaxed line-clamp-3">{item.text}</p>
                    <p className="text-[10px] text-mocha/60 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-walnut/30">
                  <button
                    onClick={() => handleCopy(item)}
                    className="text-xs text-linen/60 hover:text-brass transition-colors"
                  >
                    {copiedId === item.id ? 'Copied!' : 'Copy'}
                  </button>
                  <span className="text-walnut">·</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-linen/60 hover:text-burgundy-light transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
