"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookDetailPage() {
  const { id } = useParams(); // ISBN
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/detail?isbn=${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <p className="text-center mt-10">불러오는 중...</p>;
  if (!book || !book.title)
    return <p className="text-center mt-10">책 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="p-6 max-w-[1200px] mx-auto bg-white rounded-2xl mt-10">
      <div className="flex flex-col md:flex-row gap-6 items-stretch justify-between">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-100 md:w-1/3 rounded-lg border border-gray-100 object-cover h-96"
        />
        <div className="ml-10 flex-1 max-w-[600px] flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">{book.authors?.join(", ")}</p>
            <p className="text-gray-800 leading-relaxed">{book.contents || "내용 미리보기가 없습니다."}</p>
          </div>
          <button className="w-full px-6 py-2 rounded-xl bg-gray-200 text-black shadow-lg hover:shadow-md transform transition-all duration-300 hover:-translate-y-1">
            내 책장에 담기
          </button>
        </div>
      </div>
    </div>
  );
}
