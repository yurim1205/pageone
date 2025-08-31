import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    
    if (!query) {
      return NextResponse.json([], { status: 200 }); // 검색어 없으면 빈 배열 반환
    }

    const KAKAO_KEY=process.env.KAKAO_REST_API_KEY;

    const response = await fetch(
      `https://dapi.kakao.com/v3/search/book?target=title&query=${query}`, 
      {
      headers: {
        Authorization: `KakaoAK ${KAKAO_KEY}`,
      },
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: '카카오 API 호출 실패' }, { status: response.status });
    }
  
    const data = await response.json();
    return NextResponse.json(data.documents); // 필요한 데이터만 보내기
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}