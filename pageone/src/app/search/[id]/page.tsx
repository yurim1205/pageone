'use client';

import { useParams } from 'next/navigation';
import { mockSearchData } from '@/data/mockSearchData';
import SearchCard from '@/components/search/searchCard';

export default function SearchDetailPage() {
  const params = useParams();
  const bookId = params.id;

  const book = mockSearchData.find(b => b.id.toString() === bookId);

  if (!book) return <p>책을 찾을 수 없습니다.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
      <p className="mb-1">저자: {book.author}</p>
      <p>{book.description}</p>
    </div>
  );
}