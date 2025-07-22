"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { memo } from "react";

const HomePage = memo(() => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    if (path === "/notes") {
      // For Client Note, redirect to login first
      router.push("/login");
    } else {
      // For Timeline, go directly
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-black text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="MIB Studio Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
            <div className="ml-6 text-center">
              <h1 className="text-3xl font-bold">MIB Studio</h1>
              <p className="text-gray-300 text-lg">
                Professional Architectural & Construction Services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MIB Studio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your preferred service to get started with our professional 
            architectural and construction management tools.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Timeline Card */}
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
            onClick={() => handleNavigate("/timeline")}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-gray-700 group-hover:to-gray-800 transition-all duration-300">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Project Timeline
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage your construction projects with our comprehensive timeline tool. 
                Track progress, manage tasks, and generate professional reports.
              </p>
              <div className="bg-gradient-to-r from-gray-800 to-black text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105">
                Get Started
              </div>
            </div>
          </div>

          {/* Client Note Card */}
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
            onClick={() => handleNavigate("/notes")}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-gray-700 group-hover:to-gray-800 transition-all duration-300">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Client Notes
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Create and manage detailed client notes and meeting records. 
                Secure access with customer authentication for privacy.
              </p>
              <div className="bg-gradient-to-r from-gray-800 to-black text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105">
                Login Required
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2024 MIB Studio. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
