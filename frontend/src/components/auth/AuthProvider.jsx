'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getSocket } from '@/lib/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pulseparty_token');
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch('/auth/me')
      .then((data) => {
        setUser(data);
        const socket = getSocket();
        socket.emit('presence:login', { userId: data._id });
      })
      .catch(() => {
        localStorage.removeItem('pulseparty_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(payload) {
        const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
        localStorage.setItem('pulseparty_token', data.token);
        setUser(data.user);
        getSocket().emit('presence:login', { userId: data.user._id });
        return data;
      },
      async register(payload) {
        const data = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
        localStorage.setItem('pulseparty_token', data.token);
        setUser(data.user);
        getSocket().emit('presence:login', { userId: data.user._id });
        return data;
      },
      logout() {
        localStorage.removeItem('pulseparty_token');
        setUser(null);
        window.location.href = '/login';
      },
      refreshUser: async () => {
        const data = await apiFetch('/auth/me');
        setUser(data);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
