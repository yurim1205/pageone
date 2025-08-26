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
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* 책 표지 & 텍스트 */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.cover_url}
          alt={book.title}
          className="w-full md:w-1/3 rounded-lg border border-gray-100 object-cover"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-black mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-4">저자: {book.author}</p>
          <p className="text-gray-800 leading-relaxed">{book.description}</p>
        </div>
      </div>

      {/* 등록일 */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
        등록일: {new Date(book.created_at).toLocaleDateString()}
      </div>

      {/* 추천 도서 */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-black">추천하는 도서</h2>
        {relatedLoading ? (
          <p className="text-gray-500">추천 도서를 불러오는 중...</p>
        ) : relatedBooks && relatedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
