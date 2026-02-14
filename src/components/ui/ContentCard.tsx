'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ContentItem } from '@/types';
import { copyToClipboard, exportAsImage } from '@/lib/export';
import { addFavorite, isFavorite, removeFavorite } from '@/lib/favorites';

interface ContentCardProps {
  item: ContentItem;
  onFavoriteChange?: () => void;
}

const BADGE_CLASS: Record<string, string> = {
  joke: 'badge-joke',
  excuse: 'badge-excuse',
  roast: 'badge-roast',
  fact: 'badge-fact',
  meme: 'badge-meme',
  corporate: 'badge-corporate',
};

export function ContentCard({ item, onFavoriteChange }: ContentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(() => isFavorite(item.id));
  const [exporting, setExporting] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(item.text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (saved) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
    setSaved(!saved);
    onFavoriteChange?.();
  };

  const handleExport = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      await exportAsImage(cardRef.current, `chaoshub-${item.type}-${Date.now()}.png`);
    } catch {
      /* Error handled in export.ts */
    }
    setExporting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div ref={cardRef} className="card p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className={`badge ${BADGE_CLASS[item.type] || 'badge-joke'}`}>
            {item.type}
          </span>
          <span className="text-[10px] text-mocha">{item.source}</span>
        </div>

        {item.imageUrl && (
          <div className="mb-4 rounded-md overflow-hidden">
            <img src={item.imageUrl} alt={item.text || 'Generated content'} className="w-full h-auto" />
          </div>
        )}

        <p className="text-parchment text-base leading-relaxed mb-5 font-sans">
          {item.text}
        </p>

        <div className="flex items-center gap-2 pt-3 border-t border-walnut/50">
          <ActionBtn
            onClick={handleCopy}
            label={copied ? 'Copied' : 'Copy'}
            icon={copied ? CheckIcon : CopyIcon}
            active={copied}
          />
          <ActionBtn
            onClick={handleSave}
            label={saved ? 'Saved' : 'Save'}
            icon={saved ? HeartFilledIcon : HeartIcon}
            active={saved}
          />
          <ActionBtn
            onClick={handleExport}
            label={exporting ? 'Exporting...' : 'Export'}
            icon={DownloadIcon}
            disabled={exporting}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Action Button ── */
interface ActionBtnProps {
  onClick: () => void;
  label: string;
  icon: React.FC;
  active?: boolean;
  disabled?: boolean;
}

function ActionBtn({ onClick, label, icon: Icon, active, disabled }: ActionBtnProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
        transition-colors duration-150
        ${active
          ? 'text-brass bg-brass/10'
          : 'text-linen/70 hover:text-parchment hover:bg-surface-overlay'
        }
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
      aria-label={label}
    >
      <Icon />
      <span>{label}</span>
    </motion.button>
  );
}

/* ── Inline Icons ── */
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function HeartFilledIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
