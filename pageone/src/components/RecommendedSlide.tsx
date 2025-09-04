// components/RecommendedSlide.tsx
"use client";

import Link from "next/link";
import React from "react";

interface Book {
  isbn: string;
  title: string;
  authors: string[];
  thumbnail: string;
}

interface RecommendedSlideProps {
  books: Book[];
}

const RecommendedSlide: React.FC<RecommendedSlideProps> = ({ books }) => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">작가 추천 도서</h2>
      <div className="flex overflow-x-auto gap-4 scrollbar-hide py-2">
        {books.map((book) => (
          <Link
            key={book.isbn}
            href={`/books/${book.isbn}`}
            className="min-w-[150px] bg-white rounded-lg shadow-md p-2 flex-shrink-0 hover:shadow-lg transition"
          >
            <div className="h-40 w-full mb-2 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
              <img
                src={book.thumbnail || "/images/default_cover.png"}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-sm font-semibold truncate">{book.title}</h3>
            <p className="text-xs text-gray-500 truncate">
              {book.authors?.length > 0 ? book.authors.join(", ") : "저자 미상"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSlide;
