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
      let errorMessage = "회원가입 중 오류가 발생했습니다.";

      // Supabase가 반환하는 에러 메시지/코드에 따라 한글화 처리
      if (
        error.message.includes("User already registered") ||
        error.message.includes("duplicate key")
      ) {
        errorMessage = "이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.";
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
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
        let insertErrorMessage = "사용자 정보를 저장하는 중 오류가 발생했습니다.";
  
        if (insertError.message.includes("duplicate key")) {
          insertErrorMessage = "이미 등록된 이메일입니다. 다른 이메일을 사용해주세요.";
        }
  
        return NextResponse.json({ error: insertErrorMessage }, { status: 500 });
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
      let errorMessage = "서버 내부 오류가 발생했습니다.";
    
      if (err.message.includes("User already registered")) {
        errorMessage = "이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.";
      }
    
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }