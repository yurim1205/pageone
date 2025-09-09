"use client";

import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

function SearchFallback() {
  return (
    <div className="p-4 text-center">
      <p className="text-gray-500 text-lg">검색 페이지 로딩 중...</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageClient />
    </Suspense>
  );
}