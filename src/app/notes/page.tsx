"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Note } from "@/type/noteType";
import { useNote } from "@/hooks/note/useNote";

export default function NotesPage() {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
  });

  const { fetchNotes, isLoading, notes, error, deleteNote, user } = useNote();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user?.customerId) {
      console.log("No customerId, waiting for authentication...");
      return;
    }

    if (hasFetched.current) {
      console.log("Already fetched notes, skipping");
      return;
    }

    fetchNotes(searchFilters)
      .then(() => {
        console.log("Notes fetched successfully");
      })
      .catch((error) => {
        console.error("Failed to fetch notes:", error);
      });

    hasFetched.current = true;
  }, [user?.customerId]);

  useEffect(() => {
    if (user?.customerId && hasFetched.current) {
      console.log("Search filters changed, refetching notes");
      fetchNotes(searchFilters);
    }
  }, [searchFilters.search, searchFilters.startDate, searchFilters.endDate]);

  const handleAddNote = useCallback(() => {
    router.push("/notes/create");
  }, [router]);

  const handleDeleteNote = useCallback(
    async (noteId: number) => {
      if (!confirm("คุณต้องการลบบันทึกนี้หรือไม่?")) return;

      const respone = await deleteNote(noteId);

      if (!respone?.success) {
        alert("ไม่สามารถลบบันทึกได้ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      await fetchNotes(searchFilters);
    },
    [deleteNote, fetchNotes, searchFilters]
  );

  const handleExportPDF = useCallback(
    (note: Note) => {
      router.push(`/notes/${note.id}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Search and Filter Section */}
      <div className="bg-white px-2 md:px-6 pt-6 pb-3 rounded-xl shadow-lg border border-gray-200 my-4">
        <form
          className="flex justify-between flex-wrap md:flex-nowrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            fetchNotes(searchFilters);
          }}
        >
          <div className="flex flex-col gap-1 w-full md:w-[50%]">
            <label className="block text-sm font-semibold text-gray-800">
              Title (หัวข้อ)
            </label>
            <input
              type="text"
              placeholder="กรอกหัวข้อการประชุม"
              value={searchFilters.search}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, search: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1 w-full md:w-[16%]">
            <label className="block text-xs md:text-sm font-semibold text-gray-800">
              Start Date (วันที่เริ่ม)
            </label>
            <input
              type="date"
              value={searchFilters.startDate}
              onChange={(e) =>
                setSearchFilters({
                  ...searchFilters,
                  startDate: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-gray-50 focus:bg-white transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-1 w-full md:w-[16%]">
            <label className="block text-xs md:text-sm font-semibold text-gray-800">
              End Date (วันที่สิ้นสุด)
            </label>
            <input
              type="date"
              value={searchFilters.endDate}
              onChange={(e) =>
                setSearchFilters({
                  ...searchFilters,
                  endDate: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-gray-50 focus:bg-white transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-1 w-full md:w-[16%]">
            <label className="block text-xs md:text-sm font-semibold text-gray-800">
              ค้นหา
            </label>
            <button
              className="bg-gradient-to-r from-gray-800 to-black text-white w-full px-4 py-3 rounded-lg mt-auto hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              type="submit"
            >
              ค้นหา
            </button>
          </div>
        </form>

        <div className="flex flex-col mt-4 text-sm text-gray-700 text-center font-medium bg-gray-100 py-2 rounded-lg">
          <div>
            พบบันทึกทั้งหมด:{" "}
            <span className="font-bold text-gray-900">{notes.length}</span>{" "}
            รายการ
          </div>
          <div>
            Total:{" "}
            <span className="font-bold text-gray-900">{notes.length}</span> List
          </div>
        </div>
      </div>

      <div className="flex w-full items-center mb-6">
        <button
          onClick={handleAddNote}
          className="bg-gradient-to-r from-gray-800 to-black text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full font-semibold text-lg"
        >
          + เพิ่มบันทึกใหม่
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white transition ease-in-out duration-150">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              กำลังโหลด...
            </div>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Header - แสดงแค่หัวข้อและข้อมูลพื้นฐาน */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex gap-10 justify-evenly md:justify-start pb-4">
                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 hover:text-gray-700 cursor-pointer">
                      โปรเจค: {note.project}
                    </h3>
                    <h3 className="md:text-xl font-bold text-gray-900 mb-2 hover:text-gray-700 cursor-pointer">
                      หัวข้อ: {note.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm justify-evenly md:justify-start">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                      วันที่:{" "}
                      {new Date(note.createDate).toLocaleDateString("th-TH")}
                    </span>
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full font-medium">
                      ID: {user?.customerId}
                    </span>
                    {note.attendees && note.attendees.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        ผู้เข้าร่วม: {note.attendees.length} คน
                      </span>
                    )}
                    {note.noteAttachment && note.noteAttachment.length > 0 && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        ไฟล์แนบ: {note.noteAttachment.length} ไฟล์
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 justify-evenly md:justify-end">
                <button
                  onClick={() => handleExportPDF(note)}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-6 rounded-lg text-sm font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  ดูเพิ่มเติม
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="bg-red-600 text-white py-2 px-6 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
