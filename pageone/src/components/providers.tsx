'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import { supabase } from '@/lib/supabaseClient';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { restoreSession, user, logout, isLoggingOut } = useAuthStore();
  const { loadBookmarks } = useBookmarkStore();

  useEffect(() => {
    let mounted = true;
    
    // 앱 시작 시 세션 복원
    restoreSession();

    // Supabase auth 상태 변화 리스너 설정
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // 컴포넌트가 언마운트되었으면 처리하지 않음
        if (!mounted) return;
        
        // 개발 환경에서만 로그 출력
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state changed:', event, 'Session:', !!session, 'User:', session?.user?.id);
        }
        
        switch (event) {
          case 'SIGNED_OUT':
            if (!session && !isLoggingOut) {
              console.log('Executing logout due to SIGNED_OUT without session');
              logout();
            } else if (isLoggingOut) {
              console.log('Skipping logout - already in progress');
            }
            break;
          case 'SIGNED_IN':
            if (session) {
              console.log('Executing restoreSession due to SIGNED_IN');
              restoreSession();
            }
            break;
          case 'TOKEN_REFRESHED':
            if (session) {
              console.log('Executing restoreSession due to TOKEN_REFRESHED');
              restoreSession();
            }
            break;
        }
      }
    );

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // 의존성 배열을 비워서 한 번만 실행

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
