'use client';

import SearchCard from "@/components/search/searchCard";
import { mockSearchData } from "@/data/mockSearchData";

export default function SearchPage() {
        return (
          <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">검색 결과</h1>
            <div className="space-y-4">
              {mockSearchData.map((book) => (
                <SearchCard key={book.id} {...book} />
              ))}
            </div>
          </div>
        );
}