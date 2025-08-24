import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-gray-100 fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between  p-4">
        {/* 로고 */}
        <Link href="/">
          <h1 className="text-2xl font-bold">PageOne</h1>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex space-x-4">
          <Link href="/projects" className="hover:text-blue-500">로그인</Link>
          <Link href="/contact" className="hover:text-blue-500">회원가입</Link>
          <Link href="/contact" className="hover:text-blue-500">내 책장</Link>
          
        </nav>
      </div>
    </header>
  );
}
