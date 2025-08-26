"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import SearchCard from "@/components/search/searchCard";

const fetchBooks = async (query: string) => {
  try {
    const res = await fetch(`/api/books?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  // URL에서 검색어 파라미터 가져오기
  useEffect(() => {
    const query = searchParams.get('q') || searchParams.get('query') || '';
    setSearch(query);
  }, [searchParams]);

  const { data: books, isLoading, error } = useQuery({
    queryKey: ["books", search],
    queryFn: () => fetchBooks(search),
    enabled: search !== "", // search가 있을 때만 fetch
  });

  if (isLoading) return (
    <div className="p-4 max-w-4xl mx-auto">
      <p className="text-center mt-8">로딩 중...</p>
    </div>
  );

  if (error) return (
    <div className="p-4 max-w-4xl mx-auto">
      <p className="text-red-500 text-center mt-8">
        오류 발생: {(error as Error).message}
      </p>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {search && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-center mt-10 mb-5">
            "{search}"에 대한 검색 결과
          </h1>
          <p className="text-gray-600">
            총 {books?.length || 0}개의 도서
          </p>
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
      
      <div className="space-y-4">
        {books && books.length > 0 ? (
          books.map((book: any) => (
            <SearchCard key={book.id} {...book} />
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