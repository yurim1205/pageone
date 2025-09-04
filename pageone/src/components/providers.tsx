'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import { supabase } from '@/lib/supabaseClient';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { restoreSession, user, logout } = useAuthStore();
  const { loadBookmarks } = useBookmarkStore();

  useEffect(() => {
    // 앱 시작 시 세션 복원
    restoreSession();

    // Supabase auth 상태 변화 리스너 설정
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          if (!session) {
            // 세션이 없으면 로그아웃 처리
            logout();
          } else {
            // 새로운 세션으로 사용자 정보 업데이트
            restoreSession();
          }
        }
        
        if (event === 'SIGNED_IN') {
          restoreSession();
        }
      }
    );

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      subscription.unsubscribe();
    };
  }, [restoreSession, logout]);

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
