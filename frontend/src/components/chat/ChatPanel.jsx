'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { flagEmoji } from '@/lib/flags';
import { Smile, SendHorizonal, Gift } from 'lucide-react';

export default function ChatPanel({ room, user, socket }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!room?._id) return;
    apiFetch(`/messages/room/${room._id}`).then(setMessages).catch(() => {});
  }, [room?._id]);

  useEffect(() => {
    if (!socket) return;
    const handler = (message) => setMessages((prev) => [...prev, message]);
    socket.on('room:chat', handler);
    return () => socket.off('room:chat', handler);
  }, [socket]);

  function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('room:chat', {
      roomId: room._id,
      from: user._id,
      text,
    });
    setText('');
  }

  return (
    <div className="glass flex h-[600px] flex-col rounded-[32px] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Chat multimedia</h3>
          <p className="text-sm text-white/55">Emojis, GIFs y pegado de imágenes listo para ampliar.</p>
        </div>
        <div className="flex gap-2 text-white/55">
          <button className="rounded-2xl border border-white/10 p-2"><Smile size={18} /></button>
          <button className="rounded-2xl border border-white/10 p-2"><Gift size={18} /></button>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message._id} className={`rounded-2xl p-3 ${String(message.from?._id) === String(user._id) ? 'ml-8 bg-violet-500/15' : 'mr-8 bg-white/6'}`}>
            <div className="mb-1 flex items-center gap-2 text-xs text-white/50">
              <span>{flagEmoji(message.from?.countryCode)}</span>
              <span className="font-semibold text-white/75">{message.from?.name}</span>
              <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
            </div>
            {message.text ? <p className="text-sm leading-6">{message.text}</p> : null}
            {message.gifUrl ? <img src={message.gifUrl} alt="gif" className="mt-2 max-h-48 rounded-2xl" /> : null}
            {message.image ? <img src={message.image} alt="adjunto" className="mt-2 max-h-48 rounded-2xl" /> : null}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input className="input" placeholder="Escribe un mensaje..." value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn-primary flex items-center gap-2"><SendHorizonal size={16} /> Enviar</button>
      </form>
    </div>
  );
}
