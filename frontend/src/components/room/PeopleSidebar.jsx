'use client';

import { useMemo } from 'react';
import { flagEmoji } from '@/lib/flags';
import { Crown, Link2, MessageCirclePlus } from 'lucide-react';

export default function PeopleSidebar({ room, currentUser }) {
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/rooms/${room?._id}` : '';
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Únete a mi sala de PulseParty: ${inviteUrl}`)}`;
  const isOwner = useMemo(() => String(room?.owner?._id || room?.owner) === String(currentUser?._id), [room, currentUser]);

  async function copy() {
    await navigator.clipboard.writeText(`${inviteUrl}\nCódigo: ${room?.inviteCode}`);
    alert('Enlace copiado');
  }

  return (
    <div className="glass rounded-[32px] p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold">Personas</h3>
        <p className="text-sm text-white/55">Invitación viral, presencia online y control de sala.</p>
      </div>

      <div className="mb-4 grid gap-2">
        <button onClick={copy} className="btn-secondary flex items-center justify-center gap-2"><Link2 size={16} /> Copiar enlace</button>
        <a href={whatsappUrl} target="_blank" className="btn-primary text-center">Compartir en WhatsApp</a>
      </div>

      <div className="space-y-2">
        {room?.participants?.map((person) => (
          <div key={person._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <div>
              <p className="font-medium">{flagEmoji(person.countryCode)} {person.name}</p>
              <p className="text-xs text-white/50">{person.online ? 'En línea' : 'Desconectado'}</p>
            </div>
            <div className="flex items-center gap-2 text-white/55">
              {String(room?.owner?._id || room?.owner) === String(person._id) ? <Crown size={16} className="text-amber-300" /> : null}
              <button className="rounded-xl border border-white/10 p-2"><MessageCirclePlus size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {isOwner ? (
        <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
          Como creador puedes cambiar sala pública/privada, bloquear el control del reproductor y expulsar usuarios desde el panel de edición.
        </div>
      ) : null}
    </div>
  );
}
