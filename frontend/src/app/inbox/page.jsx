'use client';

import Protected from '@/components/auth/Protected';
import AppShell from '@/components/ui/AppShell';
import DirectInbox from '@/components/social/DirectInbox';
import { useAuth } from '@/components/auth/AuthProvider';

export default function InboxPage() {
  const { user } = useAuth();
  return (
    <Protected>
      <AppShell>
        {user ? <DirectInbox user={user} /> : null}
      </AppShell>
    </Protected>
  );
}
