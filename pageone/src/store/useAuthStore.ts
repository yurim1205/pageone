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
  isRestoring: boolean;
  isLoggingOut: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  isRestoring: false,
  isLoggingOut: false,

  signup: async (email, password, name) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      
      if (error) {
        let errorMessage = "회원가입 중 오류가 발생했습니다.";
        
        if (error.message.includes('User already registered') || 
            error.message.includes('duplicate key') ||
            error.message.includes('already registered')) {
          errorMessage = "이미 등록된 이메일입니다.";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "비밀번호는 최소 6자 이상이어야 합니다.";
        } else if (error.message.includes('Invalid email')) {
          errorMessage = "유효하지 않은 이메일 형식입니다.";
        }
        
        throw new Error(errorMessage);
      }
      
      if (!data.user) throw new Error("사용자 생성에 실패했습니다.");

      // users 테이블에 추가
      const { error: insertError } = await supabase.from("users").insert([{ 
        id: data.user.id, 
        email, 
        name 
      }]);
      
      if (insertError) {
        let insertErrorMessage = "사용자 정보 저장 중 오류가 발생했습니다.";
        
        if (insertError.message.includes('duplicate key')) {
          insertErrorMessage = "이미 등록된 이메일입니다.";
        }
        
        throw new Error(insertErrorMessage);
      }

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
      // 콘솔 에러 방지 - 필요한 경우에만 로그
      // console.error("Signup error:", error);
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
    const { isLoggingOut } = get();
    
    // 이미 로그아웃 중이면 중복 실행 방지
    if (isLoggingOut) {
      return;
    }
    
    set({ isLoggingOut: true });
    
    try {
      await supabase.auth.signOut();
      sessionStorage.removeItem("supabase_session");
      set({ user: null });
    } finally {
      set({ isLoggingOut: false });
    }
  },

  restoreSession: async () => {
    const { isRestoring } = get();
    
    // 이미 복원 중이면 중복 실행 방지
    if (isRestoring) return;
    
    set({ isRestoring: true });
    
    try {
      // Supabase 자체 세션 확인 (localStorage에서 자동 관리)
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        sessionStorage.removeItem("supabase_session");
        set({ user: null, isRestoring: false });
        return;
      }

      if (!session) {
        // 세션이 없으면 저장된 세션도 제거
        sessionStorage.removeItem("supabase_session");
        set({ user: null, isRestoring: false });
        return;
      }

      // 세션이 있으면 사용자 정보 조회
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userError) {
        await supabase.auth.signOut();
        sessionStorage.removeItem("supabase_session");
        set({ user: null, isRestoring: false });
        return;
      }

      // 세션 저장 (최신 토큰으로 업데이트)
      sessionStorage.setItem("supabase_session", JSON.stringify(session));
      set({ user: userData });

    } catch (error) {
      // 오류 발생 시 모든 세션 정보 제거
      await supabase.auth.signOut();
      sessionStorage.removeItem("supabase_session");
      set({ user: null });
    } finally {
      set({ isRestoring: false });
    }
  },
}));
