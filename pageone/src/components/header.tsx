'use client';

import Link from 'next/link';
import SearchBar from 'components/search/searchBar';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleLogout = async () => {
    await logout();
    setIsModalOpen(false);
    router.push('/');
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <div className="max-w-full mx-auto flex justify-between  p-4">
        {/* 로고 */}
        <Link href="/">
          <h1 className="text-3xl font-bold">PageOne</h1>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex space-x-4">
          <SearchBar onSearch={handleSearch} />
          
          {user ? (
            // 로그인된 상태
            <>
              <span className="text-gray-500 mt-1">
                <span className="text-black">{user.name}</span>님
              </span>
              <Link href="/scrap" 
                className="text-black hover:text-black mt-1">내 책장</Link>
              <button
                onClick={()=>setIsModalOpen(true)}
                className="text-black hover:text-black mb-2 mt-1 cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            // 로그아웃된 상태
            <>
              <Link href="/login"
                className="text-gray-500 hover:text-black mt-1">로그인</Link>
              <Link href="/signup" 
                className="text-gray-500 hover:text-black mt-1">회원가입</Link>
            </>
          )}
        </nav>
      </div>

      {isModalOpen && (
        <div className="
        fixed inset-0 flex bg-opacity-10 items-center justify-center z-[1000] backdrop-blur-[10px]">
          {/* 모달 박스 */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">로그아웃 하시겠습니까?</h2>
            <div className="flex justify-around">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                확인
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
