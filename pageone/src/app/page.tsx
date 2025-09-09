'use client';
import { literata } from '@/app/font/literata';
import SearchBar from 'components/search/searchBar';
import { useRouter } from 'next/navigation';
import Footer from 'components/footer';

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className={`${literata.variable} min-h-screen flex flex-col items-end mr-20 justify-center bg-white`}>
       <div className="flex flex-col items-end space-y-6">
        <h1 className="font-literata text-[60px] text-gray-900 text-right leading-tight mb-10">
          Bookshelf<br />Made for You
        </h1>

        <SearchBar onSearch={handleSearch} isMain={true}/>
      </div>
      {/* <Footer /> */}
    </div>
  );
}