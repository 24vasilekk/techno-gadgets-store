import { Icon } from '@/components/icons';

const categoryIcons = ['apple', 'accessories', 'smartphones', 'other'] as const;
const socialIcons = ['threads', 'telegram', 'instagram', 'max'] as const;
const uiIcons = ['search', 'filter', 'cart', 'delivery', 'pickup', 'cash', 'card', 'favorite', 'sort', 'stock', 'config'] as const;

export function IconExamples(): JSX.Element {
  return (
    <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Category Icons</p>
        <div className="flex flex-wrap gap-2">
          {categoryIcons.map((name) => (
            <span key={name} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground">
              <Icon name={name} size={20} />
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Social Icons</p>
        <div className="flex flex-wrap gap-2">
          {socialIcons.map((name) => (
            <span key={name} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground">
              <Icon name={name} size={20} />
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">UI Icons</p>
        <div className="flex flex-wrap gap-2">
          {uiIcons.map((name) => (
            <span key={name} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground">
              <Icon name={name} size={20} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

