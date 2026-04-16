'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

function ResetPasswordInner() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [devUrl, setDevUrl] = useState('');

  async function requestReset(e) {
    e.preventDefault();
    const data = await apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    setMessage(data.message);
    if (data.devResetUrl) setDevUrl(data.devResetUrl);
  }

  async function savePassword(e) {
    e.preventDefault();
    await apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
    setMessage('Contraseña restablecida. Ya puedes iniciar sesión.');
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="glass w-full max-w-lg rounded-[32px] p-8">
        <h1 className="text-3xl font-black">Recuperación de cuenta</h1>
        {!token ? (
          <form onSubmit={requestReset} className="mt-6 space-y-3">
            <input className="input" type="email" placeholder="Tu correo" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn-primary w-full">Enviar token seguro por correo</button>
            {message ? <p className="text-sm text-white/60">{message}</p> : null}
            {devUrl ? <a href={devUrl} className="text-sm text-cyan-300 underline">Abrir enlace de recuperación (modo dev)</a> : null}
          </form>
        ) : (
          <form onSubmit={savePassword} className="mt-6 space-y-3">
            <input className="input" type="password" placeholder="Nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn-primary w-full">Guardar nueva contraseña</button>
            {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center p-4 text-white/70">Cargando…</main>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
