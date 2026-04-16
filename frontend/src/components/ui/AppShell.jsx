'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageCircleMore, Settings, Tv2, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { flagEmoji } from '@/lib/flags';
import BackgroundLayer from './BackgroundLayer';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inbox', label: 'Inbox', icon: MessageCircleMore },
  { href: '/settings', label: 'Ajustes', icon: Settings },
];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <BackgroundLayer user={user} />
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 p-4 lg:p-6">
        <aside className="glass hidden w-80 shrink-0 rounded-[32px] p-5 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-xl font-bold">P</div>
            <div>
              <p className="text-xl font-bold">PulseParty</p>
              <p className="text-sm text-white/50">Social Watch Party</p>
            </div>
          </div>

          <div className="glass-soft mb-6 rounded-3xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-white/60">Tu perfil</span>
              <span>{flagEmoji(user?.countryCode)}</span>
            </div>
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="truncate text-sm text-white/50">{user?.email}</p>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${active ? 'bg-white/12 text-white' : 'text-white/60 hover:bg-white/6 hover:text-white'}`}>
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-violet-500/20 bg-violet-500/10 p-4 text-sm text-white/70">
            <div className="mb-2 flex items-center gap-2 font-semibold text-white"><Tv2 size={16} /> Modo compatible</div>
            <p>
              El proyecto sincroniza reproducción desde fuentes permitidas: YouTube, MP4/HLS propios y modo “external sync” para servicios con DRM.
            </p>
          </div>

          <button onClick={logout} className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-white/70 transition hover:bg-white/8 hover:text-white">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
