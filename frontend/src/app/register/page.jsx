'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
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
        <h1 className="text-3xl font-black">Crear cuenta</h1>
        <p className="mt-2 text-white/60">Tu bandera se detecta por IP y aparece junto a tu nombre.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" type="email" placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button className="btn-primary w-full">{loading ? 'Creando...' : 'Registrarme'}</button>
        </form>
        <div className="mt-4 text-sm text-white/55">
          <Link href="/login">Ya tengo cuenta</Link>
        </div>
      </div>
    </main>
  );
}
