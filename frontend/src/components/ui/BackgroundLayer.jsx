'use client';

import { API_BASE } from '@/lib/api';

export default function BackgroundLayer({ user }) {
  const bgUrl = user?.backgroundUrl?.startsWith('/uploads') ? `${API_BASE}${user.backgroundUrl}` : user?.backgroundUrl;

  return (
    <>
      {user?.backgroundType === 'image' && bgUrl ? (
        <div className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${bgUrl})` }} />
      ) : null}
      {user?.backgroundType === 'video' && bgUrl ? (
        <video className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-20" autoPlay muted loop playsInline>
          <source src={bgUrl} />
        </video>
      ) : null}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#0f0f0f]/80" />
    </>
  );
}
