'use client';

import { useEffect, useState } from 'react';
import Protected from '@/components/auth/Protected';
import AppShell from '@/components/ui/AppShell';
import { apiFetch } from '@/lib/api';
import CreateRoomForm from '@/components/social/CreateRoomForm';
import RoomCard from '@/components/social/RoomCard';

export default function DashboardPage() {
  const [rooms, setRooms] = useState([]);

  async function loadRooms() {
    const data = await apiFetch('/rooms');
    setRooms(data);
  }

  useEffect(() => {
    loadRooms().catch(() => {});
  }, []);

  return (
    <Protected>
      <AppShell>
        <div className="space-y-4">
          <div className="glass rounded-[32px] p-5">
            <h1 className="text-3xl font-black">Dashboard social</h1>
            <p className="mt-2 max-w-3xl text-white/60">
              Salas activas con preview, creación de watch parties, sincronización en tiempo real, mensajes privados y compatibilidad responsive para PC y móviles.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <CreateRoomForm onCreated={() => loadRooms()} />
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {rooms.map((room) => <RoomCard key={room._id} room={room} />)}
            </div>
          </div>
        </div>
      </AppShell>
    </Protected>
  );
}
