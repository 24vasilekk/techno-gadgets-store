export const motionTokens = {
  easing: [0.22, 1, 0.36, 1] as const,
  durations: {
    fast: 0.18,
    base: 0.28,
    slow: 0.42
  },
  spring: {
    type: 'spring' as const,
    stiffness: 360,
    damping: 32,
    mass: 0.7
  }
};

export const revealVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: motionTokens.durations.slow,
      ease: motionTokens.easing
    }
  }
};
