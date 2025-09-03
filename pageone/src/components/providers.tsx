'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookmarkStore } from '@/store/useBookmarkStore';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { restoreSession, user } = useAuthStore();
  const { loadBookmarks } = useBookmarkStore();

  useEffect(() => {
    // 앱 시작 시 세션 복원
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    // 사용자가 로그인되면 북마크 로드
    if (user?.id) {
      loadBookmarks(user.id);
    }
  }, [user?.id, loadBookmarks]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}  
      </AuthProvider>
      <Toaster position="top-center" reverseOrder={false}/>
    </QueryClientProvider>
  );
}
