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
      <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <span className="text-xs text-gray-400">저자: {author}</span>
      </div>
    </Link>
  );
};

export default SearchCard;