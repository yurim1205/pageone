"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center bg-white mt-10">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-16">Login</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-5
                         focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-16
                         focus:outline-none focus:border-black"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-400 cursor-pointer mt-2"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4 mb-5">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="text-black underline hover:font-medium">
            회원가입하기
          </Link>
        </p>
      </div>
    </div>
  );
}