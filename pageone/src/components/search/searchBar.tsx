'use client';
import React, { FC, useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isMain?: boolean;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch, isMain = false }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        relative mt-2 flex items-center rounded-full px-4 h-12
        ${isMain ? 'w-[480px] bg-white shadow-lg border-2 border-gray-300 hover:scale-105 transition-all duration-500' : 'w-[300px] bg-gray-200'}
      `}
    >
      <label htmlFor="searchInput" className="sr-only">Search</label>
      <input
        type="text"
        id="searchInput"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className={`
          w-full h-full pr-10 rounded-full border-none outline-none text-sm
          ${isMain ? 'bg-white text-black placeholder-gray-400' : 'bg-gray-200'}
        `}
      />
      <button
        type="submit"
        className="absolute right-3 flex items-center justify-center w-6 h-6"
      >
        <img src="/icon/search.png" alt="Search" className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBar;
