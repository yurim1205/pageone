'use client';
import React, { FC, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
    onSearch: (query: string) => void;
  }
  
  const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");
  
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSearch(query); // 부모에서 전달한 함수 호출
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mt-2 flex items-center bg-gray-200 rounded-full px-3 w-full max-w-[300px] mx-auto h-10"
    >
        <label htmlFor="searchInput" className="sr-only">Search</label>
        <input
            type="text"
            id="searchInput"
            name="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full h-full pr-10 rounded-full bg-gray-200 border-none outline-none text-sm"
          />

        <button
          type="submit"
          className="absolute right-2 flex items-center justify-center w-6 h-6"
        >
          <img
            src="/icon/search.png"
            alt="Search"
            className="w-5 h-5"
          />
        </button>
    </form>
  );
};

export default SearchBar;