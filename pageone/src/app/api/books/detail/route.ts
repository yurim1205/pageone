import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawIsbn = searchParams.get("isbn");

  if (!rawIsbn) {
    return NextResponse.json({ error: "ISBN이 필요합니다" }, { status: 400 });
  }

  // ISBN을 공백으로 분리하여 각각 시도
  const isbns = rawIsbn.split(' ').filter(isbn => isbn.length > 0);
  console.log("Original ISBN:", rawIsbn);
  console.log("Split ISBNs:", isbns);

  const KAKAO_KEY = process.env.KAKAO_REST_API_KEY;

  try {
    // 각 ISBN으로 순차적으로 검색 시도
    for (const isbn of isbns) {
      console.log("Trying ISBN:", isbn);
      
      const response = await fetch(
        `https://dapi.kakao.com/v3/search/book?target=isbn&query=${isbn}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_KEY}`,
          },
        }
      );

      console.log(`ISBN ${isbn} response.ok:`, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log(`ISBN ${isbn} results count:`, data.documents?.length || 0);
        
        if (data.documents && data.documents.length > 0) {
          return NextResponse.json(data.documents[0]); // 첫 번째 책만 반환
        }
      }
    }

    // 모든 ISBN으로 시도했지만 결과가 없음
    return NextResponse.json({ error: "책 정보를 찾을 수 없습니다." }, { status: 404 });
    
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}
