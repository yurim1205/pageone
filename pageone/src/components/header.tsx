'use client';

import Link from 'next/link';
import SearchBar from 'components/search/searchBar';

export default function Header() {
  return (
    <header className="w-full bg-gray-100 fixed top-0 left-0 z-50">
      <div className="max-w-full mx-auto flex justify-between  p-4">
        {/* 로고 */}
        <Link href="/">
          <h1 className="text-2xl font-bold">PageOne</h1>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex space-x-4">
        <SearchBar onSearch={() => {}} />
          <Link href="/projects"
           className="text-gray-500 hover:text-black mt-1">로그인</Link>
          <Link href="/contact" 
           className="text-gray-500 hover:text-black mt-1">회원가입</Link>
          <Link href="/contact" 
           className="text-gray-500 hover:text-black mt-1">내 책장</Link>
          
        </nav>
      </div>
    </header>
  );
}
