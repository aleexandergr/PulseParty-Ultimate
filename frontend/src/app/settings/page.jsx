'use client';

import { useState } from 'react';
import Protected from '@/components/auth/Protected';
import AppShell from '@/components/ui/AppShell';
import { apiFetch, API_BASE } from '@/lib/api';
import { useAuth } from '@/components/auth/AuthProvider';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  async function saveProfile(e) {
    e.preventDefault();
    await apiFetch('/users/profile', { method: 'PATCH', body: JSON.stringify(profile) });
    await refreshUser();
    setMessage('Perfil actualizado');
  }

  async function savePassword(e) {
    e.preventDefault();
    await apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(password) });
    setMessage('Contraseña actualizada');
    setPassword({ currentPassword: '', newPassword: '' });
  }

  async function uploadBackground(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem('pulseparty_token');
    const fd = new FormData();
    fd.append('background', file);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/users/background`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    await refreshUser();
    setMessage('Fondo actualizado');
  }

  const bgUrl = user?.backgroundUrl?.startsWith('/uploads') ? `${API_BASE}${user.backgroundUrl}` : user?.backgroundUrl;

  return (
    <Protected>
      <AppShell>
        <div className="grid gap-4 xl:grid-cols-2">
          <form onSubmit={saveProfile} className="glass rounded-[32px] p-5">
            <h1 className="text-2xl font-black">Ajustes de perfil</h1>
            <div className="mt-4 space-y-3">
              <input className="input" placeholder="Nombre" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              <input className="input" placeholder="Avatar URL" value={profile.avatar} onChange={(e) => setProfile({ ...profile, avatar: e.target.value })} />
              <label className="block rounded-2xl border border-dashed border-white/15 p-4 text-sm text-white/65">
                Subir fondo personalizado (imagen o .mp4)
                <input className="mt-3 block" type="file" accept="image/*,video/mp4" onChange={uploadBackground} />
              </label>
              {bgUrl ? (
                user?.backgroundType === 'video' ? (
                  <video controls className="max-h-60 rounded-2xl" src={bgUrl} />
                ) : (
                  <img alt="background" className="max-h-60 rounded-2xl object-cover" src={bgUrl} />
                )
              ) : null}
              <button className="btn-primary">Guardar perfil</button>
            </div>
          </form>

          <form onSubmit={savePassword} className="glass rounded-[32px] p-5">
            <h2 className="text-2xl font-black">Seguridad</h2>
            <div className="mt-4 space-y-3">
              <input className="input" type="password" placeholder="Contraseña actual" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} />
              <input className="input" type="password" placeholder="Nueva contraseña" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} />
              <button className="btn-primary">Cambiar contraseña</button>
              {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
            </div>
          </form>
        </div>
      </AppShell>
    </Protected>
  );
}
