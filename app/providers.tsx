'use client';

import { MotionConfig } from 'framer-motion';

import { CartProvider } from '@/features/cart/cart-context';
import { PreferencesProvider } from '@/features/preferences/preferences-context';
import { motionTokens } from '@/lib/motion';

export function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: motionTokens.durations.base,
        ease: motionTokens.easing
      }}
    >
      <PreferencesProvider>
        <CartProvider>{children}</CartProvider>
      </PreferencesProvider>
    </MotionConfig>
  );
}
