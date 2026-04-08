import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/90 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 active:translate-y-px',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-glowPink hover:brightness-110 hover:shadow-glowPink focus-visible:shadow-glowPink',
        outline:
          'border border-black/15 bg-white text-foreground hover:bg-black/[0.03] hover:border-black/25',
        ghost: 'text-muted-foreground hover:bg-black/[0.04] hover:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        filter:
          'border border-black/12 bg-white text-muted-foreground hover:border-black/25 hover:text-foreground data-[active=true]:border-primary/60 data-[active=true]:bg-primary/10 data-[active=true]:text-foreground'
      },
      size: {
        default: 'h-11 px-4',
        sm: 'h-10 rounded-md px-4',
        lg: 'h-11 rounded-md px-6',
        icon: 'h-11 w-11'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
