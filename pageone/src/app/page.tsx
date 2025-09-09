'use client';
import { literata } from '@/app/font/literata';

export default function HomePage() {
  return (
    <div className={`${literata.variable} min-h-screen flex flex-col items-center justify-center bg-white`}>
      <div className="flex flex-col items-right mr-20 justify-center w-full h-full">
        <h1 className="font-literata text-[60px] text-gray-900 text-right">
          Bookshelf<br />Made for You
        </h1>
      </div>
    </div>
  );
}
