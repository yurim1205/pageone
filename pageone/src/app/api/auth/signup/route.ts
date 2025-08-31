import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try{
    const { email, password, name } = await req.json();

    // 기본 정보만 Supabase Auth에 계정이 생성됨
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // auth에 없는 추가 정보를 테이블에 저장 (디비에 내 정보가 저장됨)
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
         id: data.user?.id,
         email, 
         password, 
         name 
        },
      ]);
      
      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      // 성공 시 유저 정보 반환
    return NextResponse.json({
        user: {
          id: data.user?.id,
          email,
          name,
          created_at: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }