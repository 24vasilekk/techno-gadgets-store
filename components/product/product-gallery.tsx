'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { motionTokens } from '@/lib/motion';

type ProductGalleryProps = {
  name: string;
  image: string;
  gallery: string[];
};

export function ProductGallery({ name, image, gallery }: ProductGalleryProps): JSX.Element {
  const images = useMemo(() => [image, ...gallery], [image, gallery]);
  const [activeImage, setActiveImage] = useState(images[0]);
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] shadow-premium">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0.35, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0.35, scale: 1.02 }}
            transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
          >
            <Image
              src={activeImage}
              alt={name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {images.map((item, index) => (
          <button
            key={`${item}-${index}`}
            type="button"
            onClick={() => setActiveImage(item)}
            className={`relative min-h-16 aspect-square overflow-hidden rounded-xl border transition-all duration-300 ease-premium ${
              activeImage === item
                ? 'border-primary shadow-glowPinkSoft'
                : 'border-white/10 hover:border-white/25'
            }`}
            aria-label={`Показать изображение ${index + 1}`}
          >
            <Image src={item} alt={`${name} ${index + 1}`} fill className="object-cover" sizes="25vw" />
          </button>
        ))}
      </div>
    </div>
  );
}
