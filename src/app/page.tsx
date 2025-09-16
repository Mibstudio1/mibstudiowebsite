"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            ยินดีต้อนรับสู่ MIB Studio
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200 px-4">
            แพลตฟอร์มครบครันสำหรับการจัดการโครงการสถาปัตยกรรมและการก่อสร้าง
            เลือกบริการที่คุณต้องการใช้งาน
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Timeline Service */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 overflow-hidden hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500 transform hover:scale-105 animate-fade-in-up animate-delay-300">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white opacity-10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 animate-float"></div>
              <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white opacity-10 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12 animate-float animate-delay-200"></div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">Timeline Management</h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300">
                  จัดการโครงการและติดตามความคืบหน้าแบบครบวงจร
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <ul className="space-y-3 sm:space-y-4 text-gray-600 mb-8 sm:mb-10">
                <li className="flex items-center animate-fade-in-up animate-delay-400">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">จัดการงานและกิจกรรม</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-500">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">ติดตามความคืบหน้าแบบ Real-time</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-600">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">สร้างรายงานและเอกสารอัตโนมัติ</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-700">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">คำนวณต้นทุนและงบประมาณ</span>
                </li>
              </ul>
              <Link
                href="/timeline"
                className="block w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg text-center hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
              >
                เข้าสู่ Timeline Management
              </Link>
            </div>
          </div>

          {/* Client Note Service */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 overflow-hidden hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500 transform hover:scale-105 animate-fade-in-up animate-delay-400">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white opacity-10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 animate-float animate-delay-100"></div>
              <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white opacity-10 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12 animate-float animate-delay-300"></div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">Client Note</h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300">
                  จัดการบันทึกและข้อมูลลูกค้าแบบครบครัน
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <ul className="space-y-3 sm:space-y-4 text-gray-600 mb-8 sm:mb-10">
                <li className="flex items-center animate-fade-in-up animate-delay-500">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">บันทึกข้อมูลลูกค้าและโครงการ</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-600">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">จัดการเอกสารและไฟล์แนบ</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-700">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">สร้างรายงานและสรุปการประชุม</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-800">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">ระบบค้นหาและกรองข้อมูล</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg text-center hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
              >
                เข้าสู่ระบบ Client Note
              </Link>
            </div>
          </div>

          {/* Budget Management Service */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 overflow-hidden hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500 transform hover:scale-105 animate-fade-in-up animate-delay-500">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white opacity-10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 animate-float animate-delay-100"></div>
              <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white opacity-10 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12 animate-float animate-delay-300"></div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">ระบบรายรับรายจ่าย</h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300">
                  จัดการงบประมาณและติดตามรายรับรายจ่ายโครงการ
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <ul className="space-y-3 sm:space-y-4 text-gray-600 mb-8 sm:mb-10">
                <li className="flex items-center animate-fade-in-up animate-delay-600">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">บันทึกรายรับรายจ่ายรายวัน</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-700">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">ติดตามงบประมาณและค่าใช้จ่าย</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-800">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">สร้างรายงานทางการเงิน</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-900">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">วิเคราะห์ต้นทุนและกำไร</span>
                </li>
              </ul>
              <a
                href="https://mibbudget.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg text-center hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
              >
                เข้าสู่ระบบรายรับรายจ่าย
              </a>
            </div>
          </div>

          {/* Construction Report Service */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 overflow-hidden hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500 transform hover:scale-105 animate-fade-in-up animate-delay-600">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white opacity-10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 animate-float animate-delay-200"></div>
              <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white opacity-10 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12 animate-float animate-delay-400"></div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">ระบบบันทึกรายงานหน้างาน</h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300">
                  บันทึกและติดตามความคืบหน้างานก่อสร้างแบบละเอียด
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <ul className="space-y-3 sm:space-y-4 text-gray-600 mb-8 sm:mb-10">
                <li className="flex items-center animate-fade-in-up animate-delay-700">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">บันทึกความคืบหน้างานก่อสร้าง</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-800">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">อัปโหลดรูปภาพและเอกสาร</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-900">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">รายงานปัญหาและอุปสรรค</span>
                </li>
                <li className="flex items-center animate-fade-in-up animate-delay-1000">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg">ติดตามคุณภาพและมาตรฐาน</span>
                </li>
              </ul>
              <a
                href="https://mibreport-rust.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg text-center hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
              >
                เข้าสู่ระบบบันทึกรายงานหน้างาน
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
