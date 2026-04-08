import type { SVGProps } from 'react';

import { cn } from '@/lib/utils';

export type PremiumIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  decorative?: boolean;
};

function IconBase({
  className,
  size = 24,
  decorative = true,
  children,
  ...props
}: PremiumIconProps & { children: React.ReactNode }): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      className={cn('shrink-0', className)}
      aria-hidden={decorative}
      role={decorative ? undefined : 'img'}
      {...props}
    >
      {children}
    </svg>
  );
}

export function AppleIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M13.7 6.5c.7-.8 1.1-2 1-3.2-1.1 0-2.3.7-3 1.6-.7.8-1.1 1.9-.9 3 1.1.1 2.2-.5 2.9-1.4Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.2 15.5c-.4.9-.6 1.4-1.2 2.2-.8 1.2-1.9 2.5-3.3 2.5-1.2 0-1.5-.7-3.1-.7s-1.9.7-3.1.7c-1.4 0-2.4-1.3-3.2-2.4-2.1-3.1-2.3-6.8-1-8.7.9-1.3 2.4-2.1 3.7-2.1 1.4 0 2.4.8 3.5.8 1.2 0 1.9-.8 3.5-.8 1.2 0 2.5.7 3.4 1.9-3 1.6-2.5 5.9.4 7.3Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function AccessoriesIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="8" width="14" height="8.6" rx="3" strokeWidth="1.7" />
      <path d="M7.3 16.6V19m6.3-2.4V19m-9.4 0h12.5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17.5 11.1h2.9v2.4h-2.9" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function SmartphonesIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <rect x="7.1" y="2.8" width="9.8" height="18.4" rx="2.6" strokeWidth="1.7" />
      <path d="M10.5 5.8h3" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="18.3" r="0.9" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function OtherCategoryIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <rect x="7" y="5.2" width="10" height="13.6" rx="3.2" strokeWidth="1.7" />
      <path d="M9.2 5.2V2.8h5.6v2.4m-5.6 13.6v2.4h5.6v-2.4" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.6" strokeWidth="1.7" />
    </IconBase>
  );
}

export function ThreadsIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M14.3 10.8c-.2-1.2-1.2-2-2.9-2-1.7 0-2.9.9-2.9 2.3 0 1.3 1.1 2.1 3.1 2.4 1.7.2 2.5.7 2.5 1.6 0 1-.9 1.7-2.3 1.7-1.3 0-2.2-.6-2.5-1.6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.3 10.8c2 .4 3.1 1.4 3.1 3.2 0 2.4-1.9 4-5 4-3.4 0-5.6-2-5.6-5.8 0-3.7 2.2-5.9 5.4-5.9 2.6 0 4.4 1.3 5 3.7Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function TelegramIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M20.3 4.4 4.1 10.6c-1 .4-1 1.8.2 2.1l4 1.1 1.5 4.4c.4 1.1 1.8.8 2.1-.2l1-3.6 4.5 3.3c.8.6 2 .1 2.1-.9L21.8 6c.2-1.1-.7-2-1.8-1.6Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function InstagramIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.6" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.5" strokeWidth="1.7" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function MaxIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.6" strokeWidth="1.7" />
      <path d="M7.8 16.2V7.9l4.2 4.7 4.2-4.7v8.3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function SearchIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="5.4" strokeWidth="1.7" />
      <path d="m15.2 15.2 3.9 3.9" strokeWidth="1.7" strokeLinecap="round" />
    </IconBase>
  );
}

export function FilterIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M4 6.8h16M6.9 12h10.2M9.2 17.2h5.6" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="8.1" cy="6.8" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="14.2" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="11.3" cy="17.2" r="1.3" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function CartIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M4.3 6.3h1.9l1.4 8.1h8.5l1.9-6.1H7.1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.9" cy="18.2" r="1.2" strokeWidth="1.7" />
      <circle cx="15.7" cy="18.2" r="1.2" strokeWidth="1.7" />
    </IconBase>
  );
}

export function DeliveryIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M3.8 7.8h10.7v8.1H3.8zM14.5 10.1h3l2.1 2.2v3.6h-5.1z" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="8" cy="17.9" r="1.3" strokeWidth="1.7" />
      <circle cx="16.9" cy="17.9" r="1.3" strokeWidth="1.7" />
    </IconBase>
  );
}

export function PickupIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M4.5 10.2 12 4.8l7.5 5.4v8.6H4.5z" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.2 20.2v-4.9h5.6v4.9" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function CashIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <rect x="3.8" y="6.8" width="16.4" height="10.4" rx="2.3" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.3" strokeWidth="1.7" />
      <path d="M7 10.2h.1M16.9 13.8h.1" strokeWidth="2.1" strokeLinecap="round" />
    </IconBase>
  );
}

export function CardIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <rect x="3.3" y="6.3" width="17.4" height="11.4" rx="2.5" strokeWidth="1.7" />
      <path d="M3.7 10.1h16.6M7.1 14.4h4.2" strokeWidth="1.7" strokeLinecap="round" />
    </IconBase>
  );
}

export function FavoriteIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M12 19.2c-3.7-2.2-6.7-4.8-6.7-8 0-2 1.6-3.6 3.5-3.6 1.3 0 2.5.7 3.2 1.8.7-1.1 1.9-1.8 3.2-1.8 1.9 0 3.5 1.6 3.5 3.6 0 3.2-3 5.8-6.7 8Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function SortIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M8 6.3v11.2m0 0-2.2-2.3M8 17.5l2.2-2.3M16 17.7V6.5m0 0-2.2 2.3M16 6.5l2.2 2.3" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function StockIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="7.2" strokeWidth="1.7" />
      <path d="m8.6 12.3 2.1 2.1 4.7-4.9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function ConfigIcon(props: PremiumIconProps): JSX.Element {
  return (
    <IconBase {...props}>
      <path d="M12 4.6v2.1m0 10.7v2.1M4.6 12h2.1m10.7 0h2.1M6.9 6.9l1.5 1.5m7.2 7.2 1.5 1.5m0-10.2-1.5 1.5m-7.2 7.2-1.5 1.5" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.2" strokeWidth="1.7" />
    </IconBase>
  );
}

const iconMap = {
  apple: AppleIcon,
  accessories: AccessoriesIcon,
  smartphones: SmartphonesIcon,
  other: OtherCategoryIcon,
  threads: ThreadsIcon,
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  max: MaxIcon,
  search: SearchIcon,
  filter: FilterIcon,
  cart: CartIcon,
  delivery: DeliveryIcon,
  pickup: PickupIcon,
  cash: CashIcon,
  card: CardIcon,
  favorite: FavoriteIcon,
  sort: SortIcon,
  stock: StockIcon,
  config: ConfigIcon
} as const;

export type IconName = keyof typeof iconMap;

type IconProps = PremiumIconProps & {
  name: IconName;
};

export function Icon({ name, ...props }: IconProps): JSX.Element {
  const Component = iconMap[name];
  return <Component {...props} />;
}

