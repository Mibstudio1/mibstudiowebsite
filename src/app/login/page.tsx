"use client";

import LoginForm from "@/components/login/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div
      className="fixed inset-0 bg-white flex items-center justify-center"
      style={{ backgroundColor: "white", margin: 0, padding: 0 }}
    >
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 z-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>กลับหน้าแรก</span>
      </button>

      <div className="flex justify-center w-[800px] h-screen md:h-[650px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="hidden md:w-1/2 bg-gradient-to-br from-gray-900 to-black md:flex flex-col justify-center items-center text-center relative border-r border-gray-300">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 space-y-4 ml-4">
            <div className="my-4 -ml-2">
              <img
                src="/logo.png"
                alt="MIB Studio Logo"
                width="300"
                height="300"
                className="object-contain max-w-full h-auto"
                style={{ maxWidth: "300px", maxHeight: "300px" }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <LoginForm />
      </div>
    </div>
  );
}
