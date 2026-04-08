import { AdminShell } from '@/components/admin/admin-shell';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <AdminShell>{children}</AdminShell>;
}
