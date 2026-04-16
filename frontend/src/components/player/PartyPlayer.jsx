'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import Hls from 'hls.js';
import { Pause, Play, Volume2, Volume1, Volume, MonitorPlay } from 'lucide-react';

function HlsVideo({ url, onProgress, onDuration, playing, volume, onReady, externalTime }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !url) return;
    if (Hls.isSupported() && url.includes('.m3u8')) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(ref.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => onReady?.());
      return () => hls.destroy();
    }
  }, [url, onReady]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.volume = volume;
    if (playing) ref.current.play().catch(() => {});
    else ref.current.pause();
  }, [playing, volume]);

  useEffect(() => {
    if (!ref.current || typeof externalTime !== 'number') return;
    if (Math.abs(ref.current.currentTime - externalTime) > 1.2) ref.current.currentTime = externalTime;
  }, [externalTime]);

  return (
    <video
      ref={ref}
      className="h-full w-full rounded-[28px] bg-black object-contain"
      controls={false}
      onTimeUpdate={() => onProgress?.({ playedSeconds: ref.current?.currentTime || 0 })}
      onLoadedMetadata={() => onDuration?.(ref.current?.duration || 0)}
      playsInline
    >
      {!url.includes('.m3u8') ? <source src={url} /> : null}
    </video>
  );
}

export default function PartyPlayer({ room, socket, user }) {
  const [playing, setPlaying] = useState(room?.playback?.isPlaying || false);
  const [videoVolume, setVideoVolume] = useState(0.9);
  const [voiceVolume, setVoiceVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(room?.playback?.currentTime || 0);
  const [duration, setDuration] = useState(room?.playback?.duration || 0);
  const playerRef = useRef(null);
  const isOwner = useMemo(() => String(room?.owner?._id || room?.owner) === String(user?._id), [room, user]);
  const isExternal = room?.content?.mode === 'external-sync';

  useEffect(() => {
    if (!socket) return;
    const handler = (state) => {
      setPlaying(state.isPlaying);
      setCurrentTime(state.currentTime || 0);
      setDuration(state.duration || 0);
      if (!isExternal && playerRef.current && typeof state.currentTime === 'number') {
        const localTime = playerRef.current?.getCurrentTime?.() || 0;
        if (Math.abs(localTime - state.currentTime) > 1.2) {
          playerRef.current.seekTo(state.currentTime, 'seconds');
        }
      }
    };
    socket.on('player:update', handler);
    return () => socket.off('player:update', handler);
  }, [socket, isExternal]);

  function syncState(next) {
    const state = {
      isPlaying: next.isPlaying ?? playing,
      currentTime: next.currentTime ?? currentTime,
      duration: next.duration ?? duration,
    };
    setPlaying(state.isPlaying);
    setCurrentTime(state.currentTime);
    setDuration(state.duration);
    socket?.emit('player:sync', { roomId: room._id, actorId: user._id, state });
  }

  const sourceBlock = (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-white/60">
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{room?.content?.provider || room?.content?.mode}</span>
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Código: {room?.inviteCode}</span>
      {room?.playerLocked ? <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-amber-100">Control bloqueado por admin</span> : null}
    </div>
  );

  return (
    <div className="glass rounded-[32px] p-4 lg:p-5">
      {sourceBlock}
      <div className="relative aspect-video overflow-hidden rounded-[28px] bg-black">
        {isExternal ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <MonitorPlay size={44} className="text-white/80" />
            <div>
              <h3 className="text-2xl font-bold">Modo External Sync</h3>
              <p className="mt-2 max-w-2xl text-white/65">
                Usa este modo con servicios protegidos por DRM. Cada usuario abre el contenido en su cuenta/suscripción legítima y PulseParty solo sincroniza play, pause y timestamps.
              </p>
            </div>
            <a href={room?.content?.url || '#'} target="_blank" className="btn-primary">Abrir contenido externo</a>
          </div>
        ) : room?.content?.mode === 'hls' || room?.content?.mode === 'mp4' || room?.content?.mode === 'drive-link' ? (
          <HlsVideo
            url={room?.content?.url}
            playing={playing}
            volume={videoVolume}
            onProgress={(state) => setCurrentTime(state.playedSeconds)}
            onDuration={setDuration}
            externalTime={currentTime}
          />
        ) : (
          <ReactPlayer
            ref={playerRef}
            url={room?.content?.url}
            playing={playing}
            controls={false}
            width="100%"
            height="100%"
            volume={videoVolume}
            onProgress={(state) => setCurrentTime(state.playedSeconds)}
            onDuration={setDuration}
          />
        )}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => syncState({ isPlaying: !playing })} disabled={room?.playerLocked && !isOwner} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 transition disabled:opacity-50">
            {playing ? <Pause size={20} /> : <Play size={20} className="fill-white" />}
          </button>
          <div>
            <p className="text-sm text-white/50">Ahora viendo</p>
            <h2 className="text-lg font-bold">{room?.content?.title || room?.name}</h2>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/70"><Volume2 size={16} /> Volumen del vídeo</div>
            <input type="range" min="0" max="1" step="0.01" value={videoVolume} onChange={(e) => setVideoVolume(Number(e.target.value))} className="w-full" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/70"><Volume1 size={16} /> Volumen de voces</div>
            <input type="range" min="0" max="1" step="0.01" value={voiceVolume} onChange={(e) => setVoiceVolume(Number(e.target.value))} className="w-full" />
            <p className="mt-1 text-xs text-white/45">Conecta este valor a la mezcla de pistas WebRTC.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
