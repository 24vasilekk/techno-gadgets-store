'use client';

import type { ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { cn } from '@/lib/utils';
import { revealVariants } from '@/lib/motion';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  y?: number;
};

export function Reveal({ children, className, delay = 0, once = true, y = 18 }: RevealProps): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, margin: '-10% 0px -10% 0px' });
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={{
        ...revealVariants,
        hidden: { ...revealVariants.hidden, y }
      }}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
