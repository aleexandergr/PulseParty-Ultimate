'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { flagEmoji } from '@/lib/flags';

export default function DirectInbox({ user }) {
  const [social, setSocial] = useState({ friends: [], pending: [] });
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    apiFetch('/users/social').then(setSocial).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeUser?._id) return;
    apiFetch(`/messages/direct/${activeUser._id}`).then(setMessages).catch(() => {});
  }, [activeUser?._id]);

  useEffect(() => {
    const handler = (message) => {
      const otherId = String(message.from?._id) === String(user._id) ? String(message.to?._id) : String(message.from?._id);
      if (String(activeUser?._id) === otherId) setMessages((prev) => [...prev, message]);
    };
    socket.on('dm:receive', handler);
    return () => socket.off('dm:receive', handler);
  }, [socket, activeUser?._id, user._id]);

  function send() {
    if (!text.trim() || !activeUser) return;
    socket.emit('dm:send', { from: user._id, to: activeUser._id, text });
    setText('');
  }

  async function acceptRequest(id) {
    await apiFetch(`/users/friend-request/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'accepted' }) });
    const data = await apiFetch('/users/social');
    setSocial(data);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <div className="glass rounded-[32px] p-4">
        <h2 className="mb-3 text-xl font-bold">Inbox privado</h2>
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="mb-2 text-sm font-semibold">Solicitudes de mensaje</p>
          <div className="space-y-2">
            {social.pending.length ? social.pending.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2">
                <span>{flagEmoji(item.from?.countryCode)} {item.from?.name}</span>
                <button onClick={() => acceptRequest(item._id)} className="rounded-xl bg-violet-600 px-3 py-1 text-sm">Aceptar</button>
              </div>
            )) : <p className="text-sm text-white/45">Sin solicitudes pendientes.</p>}
          </div>
        </div>

        <div className="space-y-2">
          {social.friends.map((friend) => (
            <button key={friend._id} onClick={() => setActiveUser(friend)} className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition ${String(activeUser?._id) === String(friend._id) ? 'bg-white/10' : 'bg-white/5 hover:bg-white/8'}`}>
              <span>{flagEmoji(friend.countryCode)} {friend.name}</span>
              <span className={`text-xs ${friend.online ? 'text-emerald-300' : 'text-white/35'}`}>{friend.online ? 'En línea' : 'Off'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass flex min-h-[680px] flex-col rounded-[32px] p-4">
        <div className="mb-4 border-b border-white/10 pb-3">
          <h3 className="text-lg font-bold">{activeUser ? `Chat con ${activeUser.name}` : 'Selecciona un amigo'}</h3>
        </div>
        <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((message) => {
            const own = String(message.from?._id) === String(user._id);
            return (
              <div key={message._id} className={`max-w-[75%] rounded-2xl px-4 py-3 ${own ? 'ml-auto bg-violet-600/20' : 'bg-white/6'}`}>
                <p>{message.text}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-2">
          <input className="input" placeholder="Escribe un mensaje privado..." value={text} onChange={(e) => setText(e.target.value)} disabled={!activeUser} />
          <button onClick={send} className="btn-primary" disabled={!activeUser}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
