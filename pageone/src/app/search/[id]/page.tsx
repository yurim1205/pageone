"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const fetchBookById = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const fetchRelatedBooks = async (author: string, excludeId: string) => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("author", author)
    .neq("id", excludeId)
    .limit(3);

  if (error) throw new Error(error.message);
  return data;
};

export default function BookDetailPage() {
  const { id } = useParams();

  const {
    data: book,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookById(id as string),
    enabled: !!id,
  });

  const {
    data: relatedBooks,
    isLoading: relatedLoading,
  } = useQuery({
    queryKey: ["relatedBooks", book?.author],
    queryFn: () => fetchRelatedBooks(book?.author, id as string),
    enabled: !!book?.author,
  });

  if (isLoading) return <p className="text-center mt-10">로딩 중...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">오류 발생: {(error as Error).message}</p>;
  if (!book) return <p className="text-center mt-10">책을 찾을 수 없습니다.</p>;

  return (
    <div className="p-6 max-w-[1200px] mx-auto bg-white rounded-2xl mt-10">
      {/* 책 표지 & 텍스트 */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch justify-between">
        <img
          src={book.cover_url}
          alt={book.title}
          className="w-100 md:w-1/3 rounded-lg border border-gray-100 object-cover h-96"
        />

        <div className="ml-10 flex-1 max-w-[600px] flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">{book.author}</p>
            <p className="text-gray-800 leading-relaxed">{book.description}</p>
          </div>

          <button
            className="w-full px-6 py-2 rounded-xl bg-gray-200 text-black
                      shadow-lg hover:shadow-md
                      transform transition-all duration-300 hover:-translate-y-1">
            내 책장에 담기
          </button>
        </div>
      </div>


      {/* 추천 도서 */}
      <div className="mt-20">
        <h2 className="text-xl font-semibold mb-4 text-black text-center">이 도서와 함께 구매가 많이 된 도서</h2>
        {relatedLoading ? (
          <p className="text-gray-500">추천 도서를 불러오는 중...</p>
        ) : relatedBooks && relatedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-between">
            {relatedBooks.map((relatedBook) => (
              <Link
                key={relatedBook.id}
                href={`/search/${relatedBook.id}`}
                className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition"
              >
                <img
                  src={relatedBook.cover_url}
                  alt={relatedBook.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="text-sm font-medium text-black truncate">{relatedBook.title}</h3>
                <p className="text-xs text-gray-500">{relatedBook.author}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">추천할 도서가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
