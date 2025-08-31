import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Supabase Auth 로그인 시도
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // 테이블에서 사용자 추가 정보 조회
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user?.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // 사용자 정보 반환
  // 로그인 성공 시 JSON 형태로 클라이언트에 반환
  // 클라이언트는 이 데이터를 useAuthStore에 저장
  return NextResponse.json({ user: userData });
}