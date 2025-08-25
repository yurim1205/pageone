'use client';

import SearchCard from "@/components/search/searchCard";
import { mockSearchData } from "@/data/mockSearchData";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const filteredData = mockSearchData.filter((book) =>
        book.title.toLowerCase().includes(query?.toLowerCase() || "")
    );
        return (
          <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">검색 결과</h1>
            <div className="space-y-4">
                {filteredData.length > 0 ? (
                    filteredData.map((book) => <SearchCard key={book.id} {...book} />)
                    ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
          </div>
        );
}