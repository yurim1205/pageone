import Link from "next/link";
import React, { FC } from "react";

interface SearchCardProps {
  isbn: string;
  title: string;
  contents: string;
  authors: string[];
  thumbnail: string;
  datetime: string;
}

const SearchCard: FC<SearchCardProps> = ({ isbn, title, contents, authors, thumbnail, datetime }) => {
  return (
    <Link href={`/search/${isbn}`}>
      <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer w-full">
        <img
          src={thumbnail || "/no-cover.png"} // 썸네일 없을 경우 대체 이미지
          alt={title}
          className="h-40 w-full object-cover rounded-md mb-2"
        />
        <h2 className="font-semibold text-lg truncate">{title}</h2>
        <span className="text-xs text-gray-400">
          저자: {authors?.length > 0 ? authors.join(", ") : "저자 미상"}
        </span>
        <p className="text-xs text-gray-500 mt-1 truncate">{contents}</p>
        <p className="text-[10px] text-gray-400 mt-1">
          발행일: {new Date(datetime).toLocaleDateString("ko-KR")}
        </p>
      </div>
    </Link>
  );
};

export default SearchCard;
