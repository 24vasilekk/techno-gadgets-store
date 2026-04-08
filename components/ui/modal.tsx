'use client';

import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { MotionFade, MotionPanel } from '@/components/motion/primitives';
import { cn } from '@/lib/utils';

type ModalProps = {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ title, description, open, onClose, children, className }: ModalProps): JSX.Element | null {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <MotionFade className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <MotionPanel
            className={cn(
              'relative w-full max-w-xl rounded-lg border border-white/15 bg-[linear-gradient(160deg,rgba(21,22,28,0.96),rgba(17,18,24,0.9))] p-6 shadow-premiumLg',
              className
            )}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl">{title}</h3>
                {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
              </div>
              <button
                type="button"
                aria-label="Закрыть модалку"
                onClick={onClose}
                className="rounded-md p-2 text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </MotionPanel>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
