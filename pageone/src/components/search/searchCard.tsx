import React, { FC } from "react";

interface SearchCardProps {
  id: number;
  title: string;
  description: string;
  author: string;
}

const SearchCard: FC<SearchCardProps> = ({ title, description, author }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <span className="text-xs text-gray-400">저자: {author}</span>
    </div>
  );
};

export default SearchCard;