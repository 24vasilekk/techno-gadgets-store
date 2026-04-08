export const designTokens = {
  colors: {
    background: 'hsl(228 22% 5%)',
    foreground: 'hsl(220 16% 96%)',
    surface: 'hsl(225 18% 8%)',
    border: 'hsl(226 12% 24%)',
    primaryPink: 'hsl(334 97% 61%)',
    mutedText: 'hsl(222 8% 70%)'
  },
  typography: {
    heading: 'Space Grotesk',
    body: 'Manrope',
    sizes: {
      hero: 'clamp(2.25rem, 5vw, 4rem)',
      h1: '2.25rem',
      h2: '1.75rem',
      body: '1rem',
      caption: '0.75rem'
    }
  },
  radius: {
    sm: '0.55rem',
    md: '0.95rem',
    lg: '1.25rem'
  },
  shadows: {
    soft: '0 4px 16px -10px rgba(0, 0, 0, 0.85)',
    medium: '0 18px 42px -24px rgba(0, 0, 0, 0.9)',
    large: '0 30px 70px -30px rgba(0, 0, 0, 0.95)',
    pinkGlow: '0 0 0 1px rgba(255, 79, 173, 0.24), 0 0 34px -14px rgba(255, 79, 173, 0.62)'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  states: {
    hoverOverlay: 'rgba(255, 255, 255, 0.05)',
    activeOverlay: 'rgba(255, 255, 255, 0.09)',
    focusRing: 'rgba(255, 79, 173, 0.5)'
  }
} as const;

export type DesignTokens = typeof designTokens;
