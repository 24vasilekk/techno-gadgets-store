import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterChipProps = {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
};

export function FilterChip({ label, active, href, onClick, className }: FilterChipProps): JSX.Element {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.02] px-4 text-sm font-semibold text-muted-foreground transition-all duration-200 ease-premium hover:border-white/25 hover:text-foreground',
          active && 'border-primary/60 bg-primary/12 text-foreground',
          className
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <Button
      type="button"
      variant="filter"
      data-active={active ? 'true' : 'false'}
      size="sm"
      className={cn('rounded-full px-4', className)}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
