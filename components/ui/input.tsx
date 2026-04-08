import * as React from 'react';

import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-base text-foreground shadow-premiumSm ring-offset-background placeholder:text-muted-foreground/80 transition duration-200 ease-premium file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/90 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-11 md:text-sm',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
