'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

interface ActionButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const VARIANT_CLASSES = {
  primary: 'bg-brass text-espresso hover:bg-gold-muted font-semibold shadow-md',
  secondary: 'border border-walnut text-linen hover:bg-surface-overlay hover:border-mocha',
  ghost: 'text-linen/70 hover:text-parchment hover:bg-surface-overlay',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function ActionButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg
        font-medium transition-colors duration-150
        focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </motion.button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M4 12a8 8 0 0 1 8-8" strokeLinecap="round" />
    </svg>
  );
}
