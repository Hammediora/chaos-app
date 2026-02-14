'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemeTemplate } from '@/types';
import { fetchMemeTemplates, fetchBuzz, fetchFact } from '@/lib/api';
import { addFavorite } from '@/lib/favorites';
import { ActionButton } from '@/components/ui/ActionButton';
import { ErrorState } from '@/components/ui/ErrorState';

export default function MemesPage() {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selected, setSelected] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(false);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [autoCaptioning, setAutoCaptioning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchMemeTemplates();
      setTemplates(data.templates || []);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadTemplates(); }, [loadTemplates]);

  /* Client-side canvas preview */
  useEffect(() => {
    if (!selected || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      /* Draw meme text */
      const fontSize = Math.max(img.width / 14, 20);
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 12;
      ctx.textAlign = 'center';

      if (topText) {
        const y = fontSize + 10;
        ctx.strokeText(topText.toUpperCase(), img.width / 2, y);
        ctx.fillText(topText.toUpperCase(), img.width / 2, y);
      }
      if (bottomText) {
        const y = img.height - 15;
        ctx.strokeText(bottomText.toUpperCase(), img.width / 2, y);
        ctx.fillText(bottomText.toUpperCase(), img.width / 2, y);
      }
    };
    img.src = selected.url;
  }, [selected, topText, bottomText]);

  const handleAutoCaption = async () => {
    setAutoCaptioning(true);
    try {
      const [buzz, fact] = await Promise.allSettled([fetchBuzz(), fetchFact()]);
      if (buzz.status === 'fulfilled') setTopText(buzz.value.text);
      if (fact.status === 'fulfilled') setBottomText(fact.value.text);
    } catch { /* silently fail */ }
    setAutoCaptioning(false);
  };

  const handleCreate = async () => {
    if (!selected) return;
    setCreating(true);

    try {
      const res = await fetch('/api/memes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selected.id, topText, bottomText }),
      });
      const data = await res.json();

      if (data.success && data.url) {
        setMemeUrl(data.url);
      } else {
        /* Use canvas fallback */
        if (canvasRef.current) {
          const url = canvasRef.current.toDataURL('image/png');
          setMemeUrl(url);
        }
      }
    } catch {
      /* Canvas fallback */
      if (canvasRef.current) {
        const url = canvasRef.current.toDataURL('image/png');
        setMemeUrl(url);
      }
    }
    setCreating(false);
  };

  const handleExport = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `chaoshub-meme-${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  const handleSaveToVault = () => {
    if (!selected) return;
    addFavorite({
      id: crypto.randomUUID(),
      type: 'meme',
      text: `${topText} / ${bottomText}`,
      source: `Meme: ${selected.name}`,
      imageUrl: memeUrl || selected.url,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="heading-display text-3xl md:text-4xl text-parchment mb-2">Meme Lab</h1>
        <p className="text-mocha text-sm mb-8">Select a template. Add text. Deploy chaos.</p>
      </motion.div>

      {error && <ErrorState onRetry={loadTemplates} />}

      {!selected ? (
        /* ── Template Grid ── */
        <>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <AnimatePresence>
                {templates.map((t, i) => (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelected(t)}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-walnut hover:border-brass/40 transition-colors"
                  >
                    <img
                      src={t.url}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
                      {t.name}
                    </p>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      ) : (
        /* ── Meme Builder ── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <button
            onClick={() => { setSelected(null); setTopText(''); setBottomText(''); setMemeUrl(null); }}
            className="text-sm text-mocha hover:text-brass transition-colors flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to templates
          </button>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="card p-4">
              <p className="text-label text-mocha mb-3">Preview: {selected.name}</p>
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-md border border-walnut"
              />
            </div>

            {/* Controls */}
            <div className="card p-5 space-y-4">
              <div>
                <label htmlFor="top-text" className="text-label text-linen block mb-1">Top Text</label>
                <input
                  id="top-text"
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="When you..."
                  className="w-full px-4 py-2.5 rounded-lg bg-surface border border-walnut text-parchment text-sm placeholder:text-mocha/60 focus:border-brass focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="bottom-text" className="text-label text-linen block mb-1">Bottom Text</label>
                <input
                  id="bottom-text"
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="But then..."
                  className="w-full px-4 py-2.5 rounded-lg bg-surface border border-walnut text-parchment text-sm placeholder:text-mocha/60 focus:border-brass focus:outline-none transition-colors"
                />
              </div>

              <ActionButton onClick={handleAutoCaption} variant="ghost" size="sm" loading={autoCaptioning} className="w-full">
                Auto-Caption (Random)
              </ActionButton>

              <div className="flex gap-2">
                <ActionButton onClick={handleCreate} loading={creating} className="flex-1">
                  Create Meme
                </ActionButton>
                <ActionButton onClick={handleExport} variant="secondary" className="flex-1">
                  Export Image
                </ActionButton>
              </div>

              <ActionButton onClick={handleSaveToVault} variant="ghost" size="sm" className="w-full">
                Save to Vault
              </ActionButton>
            </div>
          </div>

          {memeUrl && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 text-center">
              <p className="text-label text-brass mb-3">Meme Created</p>
              <img src={memeUrl} alt="Created meme" className="max-w-md mx-auto rounded-md" />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
