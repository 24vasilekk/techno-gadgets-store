'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ADMIN_SESSION_STORAGE_KEY,
  MOCK_ADMIN_CREDENTIALS,
  createMockAdminSession,
  parseAdminSession
} from '@/features/admin/auth';

export default function AdminLoginPage(): JSX.Element {
  const router = useRouter();
  const [login, setLogin] = useState<string>(MOCK_ADMIN_CREDENTIALS.login);
  const [password, setPassword] = useState<string>(MOCK_ADMIN_CREDENTIALS.password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = parseAdminSession(window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY));
    if (session) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!login.trim() || !password.trim()) {
      setError('Заполните логин и пароль.');
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      if (login.trim() !== MOCK_ADMIN_CREDENTIALS.login || password !== MOCK_ADMIN_CREDENTIALS.password) {
        setError('Неверные данные входа. Используйте mock credentials из формы.');
        setLoading(false);
        return;
      }

      const session = createMockAdminSession(login.trim());
      window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
      router.replace('/admin');
    }, 260);
  };

  return (
    <section className="container py-8 md:py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-6 shadow-premium md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Techno Agents</p>
        <h1 className="mt-2 font-heading text-3xl">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Базовый auth scaffold для внутренней зоны. Позже можно заменить на NextAuth / JWT / SSO.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="text-sm text-muted-foreground">Логин</span>
            <Input value={login} onChange={(event) => setLogin(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-muted-foreground">Пароль</span>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </Button>
        </form>
      </div>
    </section>
  );
}
