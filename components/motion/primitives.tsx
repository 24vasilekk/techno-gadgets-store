'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { motionTokens } from '@/lib/motion';

type MotionFadeProps = {
  children?: ReactNode;
  className?: string;
};

export function MotionFade({ children, className }: MotionFadeProps): JSX.Element {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
    >
      {children}
    </motion.div>
  );
}

type MotionPanelProps = {
  children: ReactNode;
  className?: string;
  from?: 'bottom' | 'right';
};

export function MotionPanel({ children, className, from = 'bottom' }: MotionPanelProps): JSX.Element {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const initial = from === 'right' ? { opacity: 0, x: 24 } : { opacity: 0, y: 20 };
  const exit = from === 'right' ? { opacity: 0, x: 24 } : { opacity: 0, y: 20 };

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={exit}
      transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
    >
      {children}
    </motion.div>
  );
}
