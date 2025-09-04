import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  signup: async (email, password, name) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      if (!data.user) throw new Error("사용자 생성 실패");

      // users 테이블에 추가
      await supabase.from("users").insert([{ id: data.user.id, email, name }]);

      // 세션 저장
      if (data.session) {
        sessionStorage.setItem("supabase_session", JSON.stringify(data.session));
      }

      set({
        user: {
          id: data.user.id,
          email,
          name,
          created_at: data.user.created_at || new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error("사용자를 찾을 수 없습니다.");

      // 세션 저장
      if (data.session) {
        sessionStorage.setItem("supabase_session", JSON.stringify(data.session));
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      // users 테이블에서 사용자 정보 조회
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      set({ user: userData });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("supabase_session");
    set({ user: null });
  },

  restoreSession: async () => {
    try {
      // Supabase 자체 세션 확인 (localStorage에서 자동 관리)
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session get error:", error);
        sessionStorage.removeItem("supabase_session");
        set({ user: null });
        return;
      }

      if (!session) {
        // 세션이 없으면 저장된 세션도 제거
        sessionStorage.removeItem("supabase_session");
        set({ user: null });
        return;
      }

      // 세션이 있으면 사용자 정보 조회
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userError) {
        console.error("User data fetch error:", userError);
        await supabase.auth.signOut();
        sessionStorage.removeItem("supabase_session");
        set({ user: null });
        return;
      }

      // 세션 저장 (최신 토큰으로 업데이트)
      sessionStorage.setItem("supabase_session", JSON.stringify(session));
      set({ user: userData });

    } catch (error) {
      console.error("Session restore failed:", error);
      // 오류 발생 시 모든 세션 정보 제거
      await supabase.auth.signOut();
      sessionStorage.removeItem("supabase_session");
      set({ user: null });
    }
  },
}));
