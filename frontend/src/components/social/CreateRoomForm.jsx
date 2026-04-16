'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

const providerOptions = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'mp4', label: 'MP4 directo' },
  { value: 'hls', label: 'HLS (.m3u8) propio' },
  { value: 'drive-link', label: 'Drive/Archivo compartido' },
  { value: 'external-sync', label: 'External sync (Netflix/Disney/Prime/Twitch/Crunchyroll)' },
];

export default function CreateRoomForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    privacy: 'public',
    content: { mode: 'youtube', url: '', title: '', poster: '', provider: 'YouTube' },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const room = await apiFetch('/rooms', { method: 'POST', body: JSON.stringify(form) });
      onCreated?.(room);
      setForm({
        name: '',
        description: '',
        privacy: 'public',
        content: { mode: 'youtube', url: '', title: '', poster: '', provider: 'YouTube' },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass rounded-[28px] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Crear sala</h2>
          <p className="text-sm text-white/55">Lista para web, tablets, móviles y futura conversión a Android/iOS.</p>
        </div>
        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">Responsive + PWA-ready</div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input className="input" placeholder="Nombre de la sala" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <select className="input" value={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.value })}>
          <option value="public">Pública</option>
          <option value="private">Privada</option>
        </select>
      </div>

      <textarea className="input mt-3 min-h-24" placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <select
          className="input"
          value={form.content.mode}
          onChange={(e) => setForm({ ...form, content: { ...form.content, mode: e.target.value, provider: providerOptions.find((i) => i.value === e.target.value)?.label || e.target.value } })}
        >
          {providerOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <input className="input" placeholder="Título del contenido" value={form.content.title} onChange={(e) => setForm({ ...form, content: { ...form.content, title: e.target.value } })} />
      </div>

      <input className="input mt-3" placeholder="URL de video / enlace externo / vídeo propio" value={form.content.url} onChange={(e) => setForm({ ...form, content: { ...form.content, url: e.target.value } })} required />
      <input className="input mt-3" placeholder="Poster/thumbnail (opcional)" value={form.content.poster} onChange={(e) => setForm({ ...form, content: { ...form.content, poster: e.target.value } })} />

      {form.content.mode === 'external-sync' ? (
        <div className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">
          Este modo no extrae ni descifra streams protegidos. Cada usuario reproduce el contenido en su propia sesión legítima y PulseParty sincroniza estados/timestamps.
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      <button disabled={saving} className="btn-primary mt-4 w-full">{saving ? 'Creando...' : 'Crear sala'}</button>
    </form>
  );
}
