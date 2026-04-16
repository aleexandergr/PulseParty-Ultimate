'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Mic, MonitorUp, Move } from 'lucide-react';

function DraggableBubble({ label, x = 20, y = 20 }) {
  const [position, setPosition] = useState({ x, y });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  function startDrag(e) {
    dragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }

  useEffect(() => {
    function move(e) {
      if (!dragging.current) return;
      setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    }
    function up() {
      dragging.current = false;
    }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [position]);

  return (
    <div
      onMouseDown={startDrag}
      className="absolute z-20 flex h-32 w-44 cursor-move flex-col justify-between rounded-3xl border border-white/10 bg-black/50 p-3 backdrop-blur-xl"
      style={{ left: position.x, top: position.y }}
    >
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>{label}</span>
        <Move size={12} />
      </div>
      <div className="flex h-full items-center justify-center rounded-2xl bg-white/6 text-sm text-white/60">PiP WebRTC</div>
    </div>
  );
}

export default function VideoCallOverlay() {
  async function shareScreen() {
    try {
      await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      alert('Captura iniciada. Puedes elegir pantalla completa o ventana específica.');
    } catch {
      alert('No se pudo iniciar la captura.');
    }
  }

  return (
    <div className="relative mt-4 min-h-56 rounded-[32px] border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Videollamada PiP Pro</h3>
          <p className="text-sm text-white/55">Miniaturas flotantes arrastrables + compartir pantalla o apps específicas.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2"><Camera size={16} /> Cámara</button>
          <button className="btn-secondary flex items-center gap-2"><Mic size={16} /> Micrófono</button>
          <button onClick={shareScreen} className="btn-primary flex items-center gap-2"><MonitorUp size={16} /> Compartir</button>
        </div>
      </div>
      <div className="relative h-40 overflow-hidden rounded-[28px] bg-gradient-to-br from-white/5 to-white/2">
        <DraggableBubble label="Tú" x={20} y={18} />
        <DraggableBubble label="Amigo 1" x={220} y={70} />
      </div>
    </div>
  );
}
