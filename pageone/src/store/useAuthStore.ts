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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  // 회원가입
  signup: async (email, password, name) => {
    set({ loading: true });
    try {
      // 1. Supabase Auth에서 사용자 생성
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;

      // 2. 자동 로그인
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      const userId = signInData.user?.id;
      if (!userId) throw new Error("User ID not found after sign-in");

      // 3. users 테이블에 insert
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ id: userId, email, name }]);
      if (insertError) throw insertError;

      // 4. Zustand 상태 업데이트
      set({
        user: {
          id: userId,
          email,
          name,
          created_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Signup Error:", error);
    } finally {
      set({ loading: false });
    }
  },

  // 로그인
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user?.id)
        .single();
      if (fetchError) throw fetchError;

      set({ user: userData });
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      set({ loading: false });
    }
  },

  // 로그아웃
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
