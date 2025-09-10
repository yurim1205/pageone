"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";    
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signup, loading, user } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signup(email, password, name);
    } catch (error: any) {
      setError(error.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <>
      <button
        onClick={() => router.push("/login")}
        className="flex items-center text-sm text-gray-600 hover:text-black mb-6 mt-5 ml-5 cursor-pointer"
      >
        <ArrowLeftIcon className="w-6 h-6 mr-2" />
      </button>
      
      <div className="flex items-center justify-center bg-white mt-6">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-16">Signup</h1>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-5
                           focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-5
                           focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">이메일 확인</label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-5
                           focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-5
                           focus:outline-none focus:border-black"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 
                         disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {loading ? "처리 중..." : "Signup"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4 mb-5">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-black underline hover:font-medium">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}