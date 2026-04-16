'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Protected from '@/components/auth/Protected';
import AppShell from '@/components/ui/AppShell';
import { apiFetch } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import PartyPlayer from '@/components/player/PartyPlayer';
import ChatPanel from '@/components/chat/ChatPanel';
import PeopleSidebar from '@/components/room/PeopleSidebar';
import VideoCallOverlay from '@/components/room/VideoCallOverlay';
import { useAuth } from '@/components/auth/AuthProvider';

export default function RoomPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const socket = useMemo(() => getSocket(), []);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/rooms/${id}`).then((data) => {
      setRoom(data);
      socket.emit('room:join', { roomId: data._id, userId: user?._id });
    }).catch(() => {});
  }, [id, socket, user?._id]);

  useEffect(() => {
    const handler = (participants) => setRoom((prev) => prev ? { ...prev, participants } : prev);
    socket.on('room:presence', handler);
    return () => socket.off('room:presence', handler);
  }, [socket]);

  if (!room || !user) {
    return <Protected><AppShell><div className="glass rounded-[32px] p-8">Cargando sala...</div></AppShell></Protected>;
  }

  return (
    <Protected>
      <AppShell>
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div>
            <PartyPlayer room={room} socket={socket} user={user} />
            <VideoCallOverlay />
          </div>
          <div className="space-y-4">
            <PeopleSidebar room={room} currentUser={user} />
            <ChatPanel room={room} user={user} socket={socket} />
          </div>
        </div>
      </AppShell>
    </Protected>
  );
}
