"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import SearchCard from "@/components/search/searchCard";

const fetchBooks = async (query: string) => {
  const res = await fetch(`/api/books/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("API 호출 실패");
  return res.json();
};

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  // URL에서 검색어 파라미터 가져오기
  useEffect(() => {
    const query = searchParams.get("q") || searchParams.get("query") || "";
    setSearch(query);
  }, [searchParams]);

  const { data: books, error, isLoading } = useQuery({
    queryKey: ["books", search],
    queryFn: () => fetchBooks(search),
    enabled: search !== "",
    initialData: [],
  });

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 text-lg">검색 페이지 로딩 중...</p>
      </div>
    );
  }

  // 에러 처리
  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <p className="text-red-500 text-center mt-8">
          오류 발생: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[1200px] mx-auto mt-10">
      {search && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-center mt-10 mb-10">
            "{search}"에 대한 검색 결과
          </h1>
          <p className="text-gray-600">총 {books?.length || 0}개의 도서</p>
        </div>
      )}

      {!search && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">전체 도서</h1>
          <p className="text-gray-600">
            총 {books?.length || 0}권의 도서가 있습니다.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {books && books.length > 0 ? (
          books.map((book: any, index: number) => (
            <SearchCard
              key={`${book.isbn || book.url || "book"}-${index}`}
              {...book}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {search ? "검색 결과가 없습니다." : "도서가 없습니다."}
            </p>
            {search && (
              <p className="text-sm text-gray-400 mt-2">
                다른 검색어로 시도해보세요.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
