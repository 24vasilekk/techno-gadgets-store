import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s | Admin'
  },
  description: 'Внутренняя admin-зона Techno Agents.',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <>{children}</>;
}
