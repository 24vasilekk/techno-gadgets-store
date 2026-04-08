import { cn } from '@/lib/utils';

type TagProps = {
  children: React.ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground transition hover:border-white/20 hover:text-foreground',
        className
      )}
    >
      {children}
    </span>
  );
}
