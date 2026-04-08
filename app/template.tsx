'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { motionTokens } from '@/lib/motion';

export default function Template({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
    >
      {children}
    </motion.div>
  );
}
