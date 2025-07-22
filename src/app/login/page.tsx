import LoginForm from "@/components/login/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="fixed inset-0 bg-white flex items-center justify-center"
      style={{ backgroundColor: "white", margin: 0, padding: 0 }}
    >
      {/* Back to Home Button */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
        <Link
          href="/"
          className="bg-gradient-to-r from-gray-800 to-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          กลับหน้าหลัก
        </Link>
      </div>

      <div className="flex justify-center w-full sm:w-[800px] h-screen md:h-[650px] bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl border-0 sm:border sm:border-gray-200 overflow-hidden mx-4 sm:mx-0">
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
