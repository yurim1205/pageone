import { useBookmarkStore } from "@/store/useBookmarkStore";
import Link from "next/link";
import React, { FC, useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface SearchCardProps {
  isbn: string;
  title: string;
  contents: string;
  authors: string[];
  thumbnail: string;
  datetime: string;
}

const SearchCard: FC<SearchCardProps> = ({ isbn, title, authors, thumbnail, datetime }) => {
  const { bookmarks, toggleBookmark } = useBookmarkStore();
  const isBookmarked = bookmarks.includes(isbn);
  const { user } = useAuthStore();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      toast.error("로그인이 필요합니다.", { duration: 1000 });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    if (pending) return;
    setPending(true);

    try {
      if (isBookmarked) {
        // 스크랩 제거
        const { error } = await supabase
          .from("scraps")
          .delete()
          .eq("isbn", isbn)
          .eq("user_id", user.id);

        if (error) throw error;

        toggleBookmark(isbn);
        toast.success("책장에서 제거되었습니다.");
      } else {
        // 스크랩 추가 (책 정보도 함께 저장)
        const { error } = await supabase
          .from("scraps")
          .insert({
            isbn,
            user_id: user.id,
            title,
            authors,
            thumbnail,
            datetime
          });

        if (error) throw error;

        toggleBookmark(isbn);
        toast.success("책장에 추가되었습니다.");
      }
    } catch (error) {
      console.error(error);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Link href={`/search/${isbn}`} className="block">
      <div className="relative p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer w-full">
        <div className="h-40 w-full rounded-md mb-2 bg-gray-200 flex items-center justify-center overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-gray-400"><svg class="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg><span class="text-xs">이미지 없음</span></div>';
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
              </svg>
              <span className="text-xs">이미지 없음</span>
            </div>
          )}
        </div>
        <h2 className="font-semibold text-lg truncate">{title}</h2>
        <span className="text-xs text-gray-400">
          저자: {authors?.length > 0 ? authors.join(", ") : "저자 미상"}
        </span>
        <p className="text-[10px] text-gray-400 mt-1">
          발행일: {new Date(datetime).toLocaleDateString("ko-KR")}
        </p>

        {/* 북마크 버튼 */}
        <button
          onClick={handleBookmark}
          disabled={pending}
          className="absolute bottom-2 right-2"
        >
          <Image
            src={
              isBookmarked
                ? "/icon/bookmarks_full.png"
                : "/icon/bookmarks.png"
            }
            alt="bookmark"
            width={20}
            height={20}
          />
        </button>
      </div>
    </Link>
  );
};

export default SearchCard;