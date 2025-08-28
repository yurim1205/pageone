import Link from "next/link";
import React, { FC } from "react";

interface SearchCardProps {
  id: number;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  created_at: string;
}

const SearchCard: FC<SearchCardProps> = ({ id, title, description, author, cover_url }) => {
  return (
    <Link href={`/search/${id}`}>
     <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer w-full">
        <img
          src={cover_url}
          alt={title}
          className="h-40 w-full object-cover rounded-md mb-2"
        />
        <h2 className="font-semibold text-lg truncate">{title}</h2>
        <span className="text-xs text-gray-400">저자: {author}</span>
    </div>
    </Link>
  );
};

export default SearchCard;