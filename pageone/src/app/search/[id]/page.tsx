"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import RecommendedSlide from "@/components/RecommendedSlide";

export default function BookDetailPage() {
  const { id } = useParams(); // ISBN
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toggleBookmark } = useBookmarkStore();

  const recommendedBooks = [
    { isbn: "111", title: "추천책 1", authors: ["작가 A"], thumbnail: "/images/book1.png" },
    { isbn: "222", title: "추천책 2", authors: ["작가 A"], thumbnail: "/images/book2.png" },
    { isbn: "333", title: "추천책 3", authors: ["작가 A"], thumbnail: "/images/book3.png" },
    { isbn: "444", title: "추천책 4", authors: ["작가 A"], thumbnail: "/images/book4.png" },
  ];

  const handleAddToScrap = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("scraps")
        .insert([
          {
            user_id: user.id,
            isbn: id, 
            title: book?.title || "제목 없음",
            authors: book?.authors?.length > 0 ? book.authors : ["저자 미상"],
            thumbnail: book?.thumbnail || "/images/default_cover.png",
            datetime: book?.datetime || new Date().toISOString(),
          },
        ])
        .select(); 
  
      if (error) throw error;
  
      toast.success("내 책장에 추가되었습니다!");
      toggleBookmark(id as string); 
    } catch (err: any) {
      if (err.code === "23505") {
        toast.error("이미 책장에 있습니다!"); // 중복 insert 처리
      } else {
        toast.error("추가 중 오류가 발생했습니다.");
        console.error(err);
      }
    }
  };

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
          <button 
          onClick={handleAddToScrap}
          className="w-full px-6 py-2 rounded-xl bg-gray-200 text-black shadow-lg
           hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            내 책장에 담기
          </button>
        </div>
      </div>

      <RecommendedSlide books={recommendedBooks} />
    </div>
  );
}