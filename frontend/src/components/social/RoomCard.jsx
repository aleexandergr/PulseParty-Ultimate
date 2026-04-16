'use client';

import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import { flagEmoji } from '@/lib/flags';
import { Users, Lock, Globe, Play } from 'lucide-react';

export default function RoomCard({ room }) {
  const preview = room?.content?.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop';

  return (
    <GlassCard className="overflow-hidden">
      <div className="relative h-44 overflow-hidden">
        <img src={preview} alt={room.name} className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs backdrop-blur-sm">Preview live</div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs backdrop-blur-sm">
          <Play size={12} className="fill-white" /> {room?.playback?.isPlaying ? 'Reproduciendo' : 'Pausado'}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{room.name}</h3>
            <p className="line-clamp-2 text-sm text-white/60">{room.description || 'Sin descripción'}</p>
          </div>
          <div className="rounded-full bg-white/8 px-3 py-1 text-xs">{room.content?.provider || room.content?.mode}</div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
          <span className="inline-flex items-center gap-1"><Users size={14} /> {room.participants?.length || 0}</span>
          <span className="inline-flex items-center gap-1">{room.privacy === 'private' ? <Lock size={14} /> : <Globe size={14} />} {room.privacy}</span>
          <span>{flagEmoji(room.owner?.countryCode)} {room.owner?.name}</span>
        </div>
        <Link href={`/rooms/${room._id}`} className="btn-primary block text-center">Entrar a la sala</Link>
      </div>
    </GlassCard>
  );
}
