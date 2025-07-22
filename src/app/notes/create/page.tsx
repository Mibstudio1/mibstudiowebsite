"use client";

import CreateNoteForm from "@/components/createNote/CreateNoteForm";
import Link from "next/link";

const CreateNote = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Back to Home Button */}
      <div className="flex justify-start p-4 sm:p-6">
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

      <div className="max-w-5xl mx-auto p-0 sm:p-4">
        <div className="bg-gradient-to-r from-gray-800 to-black rounded-t-2xl px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl font-bold text-white shadow-lg">
          <h2>Meeting Note</h2>
          <h2 className="text-xs sm:text-sm opacity-80">สรุปรายงานการประชุม</h2>
        </div>

        <CreateNoteForm />
      </div>
    </div>
  );
};

export default CreateNote;
