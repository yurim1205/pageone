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
        // 현재 사용자의 모든 스크랩 데이터 조회
        const { data: scrapData, error: scrapError } = await supabase
          .from("scraps")
          .select("*")
          .eq("user_id", user.id);

        if (scrapError) {
          console.error("스크랩 에러:", scrapError);
          throw scrapError;
        }

        if (!scrapData || scrapData.length === 0) {
          setBooks([]);
          return;
        }

        // 데이터가 이미 현재 사용자의 실제 스크랩이므로 바로 사용
        const finalBookData = scrapData;

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