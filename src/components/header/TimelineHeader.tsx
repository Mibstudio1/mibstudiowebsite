import React from "react";
import Image from "next/image";

const TimelineHeader = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 py-3">
        {/* Top navigation bar with logo and company name on the left */}
        <div className="flex items-center justify-between">
          {/* Left side - Company Logo and Name */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="/MIB final-03.png"
                alt="MIB Company Logo"
                width={50}
                height={50}
                className="object-contain filter brightness-110"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg lg:text-xl font-bold text-white tracking-wider">
                MIB Studio
              </h1>
              <p className="text-xs text-gray-300 font-light tracking-wide">
                Professional Architectural & Construction Services
              </p>
            </div>
          </div>

          {/* Right side - Reserved for future navigation items */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Future navigation items can go here */}
          </div>
        </div>

        {/* Main title section - centered */}
        <div className="text-center"></div>
      </div>

      {/* Bottom border with subtle gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
    </div>
  );
};

export default TimelineHeader;
