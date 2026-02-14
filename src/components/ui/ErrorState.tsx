'use client';

import { motion } from 'framer-motion';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong. The chaos got too chaotic.', onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-8 text-center"
    >
      <div className="text-4xl mb-4 font-serif text-burgundy-light">~</div>
      <p className="text-linen text-sm mb-1 font-medium">Well, this is awkward.</p>
      <p className="text-mocha text-xs mb-5">{message}</p>
      {onRetry && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-4 py-2 text-xs font-medium text-brass border border-brass/30 rounded-lg hover:bg-brass/10 transition-colors"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}
