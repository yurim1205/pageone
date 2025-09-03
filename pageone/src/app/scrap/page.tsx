"use client";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import SearchCard from "@/components/search/searchCard";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

interface Book {
  isbn: string;
  title: string;
  authors: string[];
  thumbnail: string;
  datetime: string;
}

export default function ScrapPage() {
  const { bookmarks } = useBookmarkStore();
  const { user } = useAuthStore();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      return;
    }

    const fetchScraps = async () => {
      try {
        // 1. 스크랩 데이터 조회
        const { data: scrapData, error: scrapError } = await supabase
          .from("scraps")
          .select("isbn")
          .eq("user_id", user.id);

        if (scrapError) {
          console.error("스크랩 에러:", scrapError);
          throw scrapError;
        }

        if (!scrapData || scrapData.length === 0) {
          setBooks([]);
          return;
        }

        // ISBN 처리: 복합 ISBN을 개별 ISBN으로 분리하고 중복 제거
        const allIsbns = [...new Set(scrapData.flatMap(s => {
          const isbns = s.isbn.split(' ').filter((isbn: string) => isbn.trim() !== '');
          return isbns;
        }))];

        // 2. 스크랩 테이블에서 상세 데이터 조회
        const { data: bookData, error: bookError } = await supabase
          .from("scraps")
          .select("*")
          .in("isbn", allIsbns);

        // 만약 결과가 없다면, LIKE 조건으로 다시 시도
        let finalBookData = bookData;
        if (!bookData || bookData.length === 0) {
          // 각 ISBN에 대해 LIKE 조건으로 검색
          const likePromises = allIsbns.map(isbn => 
            supabase
              .from("scraps")
              .select("*")
              .or(`isbn.like.%${isbn}%,isbn.like.${isbn}%`)
          );

          const likeResults = await Promise.all(likePromises);
          finalBookData = likeResults.flatMap(result => result.data || []);
        }

        if (bookError) {
          console.error("북 데이터 에러:", bookError);
          throw bookError;
        }

        // 중복 제거: id 기준으로 unique한 데이터만 유지
        const uniqueBookData = (finalBookData || []).filter((book, index, self) => 
          index === self.findIndex((b) => b.id === book.id)
        );

        // 데이터 정제
        const processedBooks = uniqueBookData.map(book => {
          let authors = book.authors;
          
          // authors가 문자열인 경우 배열로 변환
          if (typeof authors === 'string') {
            try {
              authors = JSON.parse(authors);
            } catch {
              authors = authors.split(',').map((a: string) => a.trim());
            }
          }
          
          // authors가 배열이 아닌 경우 빈 배열로 설정
          if (!Array.isArray(authors)) {
            authors = [];
          }

          return {
            ...book,
            authors,
            thumbnail: book.thumbnail || "",
            datetime: book.datetime || new Date().toISOString()
          };
        });

        setBooks(processedBooks);
      } catch (error) {
        console.error("스크랩 데이터 불러오기 실패:", error);
      }
    };

    fetchScraps();
  }, [user, bookmarks]);

  return (
    <div className="p-4 max-w-[1200px] mx-auto mt-10">
      {books.length === 0 ? (
        <p className="text-center text-gray-500">스크랩한 책이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <SearchCard key={`${book.isbn}-${index}`} {...book} contents={""} />
          ))}
        </div>
      )}
    </div>
  );
}