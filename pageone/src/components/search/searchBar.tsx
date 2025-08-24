'use client';
import React, { FC, useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
        onSubmit={handleSubmit}
        className="flex items-center bg-gray-200 rounded-[50px] p-1 max-w-[180px] mx-auto h-[32px]"
        >
    <label htmlFor="searchInput" className="sr-only">Search</label>
    <input
        type="text"
        id="searchInput"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="w-full h-[40px] px-4 rounded-[50px] border-none outline-none"
      />
      <button
        type="submit"
        className="absolute right-52 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-10 h-10"
      >
        <img
          src="/icon/search.png"
          alt="Search"
          className="w-8 h-8"
        />
      </button>
</form>

  );
};

export default SearchBar;