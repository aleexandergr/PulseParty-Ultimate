'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="glass w-full max-w-md rounded-[32px] p-8">
        <h1 className="text-3xl font-black">Bienvenido a PulseParty</h1>
        <p className="mt-2 text-white/60">Watch parties con estética dark glassmorphism y tiempo real.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input className="input" type="email" placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button className="btn-primary w-full">{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm text-white/55">
          <Link href="/register">Crear cuenta</Link>
          <Link href="/reset-password">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </main>
  );
}
