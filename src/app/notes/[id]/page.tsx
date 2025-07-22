"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Note } from "@/type/noteType";
import { useNote } from "@/hooks/note/useNote";
import ExportPDFButton from "@/components/ExportPDFButton";
import ShareButton from "@/components/ShareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faFileText,
  faCheckCircle,
  faFilePdf,
  faEdit,
  faTrash,
  faArrowLeft,
  faCalendar,
  faIdCard,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const {
    user,
    deleteNote,
    fetchNote: fetchNoteFromHook,
    note: noteFromHook,
  } = useNote();

  useEffect(() => {
    if (user?.customerId) {
      fetchNoteFromHook({ params: resolvedParams });
    }
  }, [resolvedParams.id, user?.customerId]);

  useEffect(() => {
    if (noteFromHook) {
      setNote(noteFromHook);
      setIsLoading(false);
    }
  }, [noteFromHook]);

  const handleEdit = () => {
    router.push(`/notes/${resolvedParams.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("คุณต้องการลบบันทึกนี้หรือไม่?")) return;

    const response = await deleteNote(note!.id);
    if (response?.success) {
      router.push("/notes");
    } else {
      alert("ไม่สามารถลบบันทึกได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleBack = () => {
    router.push("/notes");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">
            ไม่พบข้อมูลบันทึกการประชุม
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 to-white-100 py-4 sm:py-8">
      {/* Back to Home Button */}
      <div className="flex justify-start px-4 mb-4 sm:mb-6">
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

      <div className="max-w-5xl mx-auto px-4 md:px-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 sm:mb-6 bg-white hover:bg-gray-50 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-md hover:shadow-lg border border-gray-200 text-sm sm:text-base"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 sm:w-5 sm:h-5" />
          กลับไปรายการบันทึก
        </button>

        {/* Note Detail Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 sm:p-6 md:p-8 text-center">
            <h1 className="text-lg sm:text-xl md:text-4xl font-bold mb-4">{note.title}</h1>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full font-medium">
                  วันที่:{" "}
                  {new Date(note.createDate).toLocaleDateString("th-TH")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faIdCard} className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full font-medium">
                  ID: {note.customerId}
                </span>
              </div>
              {note.project && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFileText} className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full font-medium">
                    โปรเจค: {note.project}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Details */}
              {note.noteExpand && note.noteExpand.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faFileText}
                        className="w-3 h-3 sm:w-5 sm:h-5 text-white"
                      />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                        Meeting Info
                      </h2>
                      <h2 className="text-xs sm:text-sm font-light text-gray-600">
                        รายละเอียดการประชุม
                      </h2>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {note.noteExpand.map((detail, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-bold text-gray-900 mb-3 md:text-lg break-words">
                          {detail.name}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-xs md:text-base whitespace-pre-wrap break-words">
                          {detail.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {note.noteExpand && note.noteExpand.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="w-5 h-5 text-white"
                      />
                    </div>
                    <div>
                      <h2 className="md:text-xl font-bold text-gray-900">
                        Summarize
                      </h2>
                      <h2 className="text-xs md:text-sm font-light text-gray-600">
                        ข้อสรุป
                      </h2>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {note.noteExpand.map((summary, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-green-600 font-bold text-sm break-words">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-700 leading-relaxed text-xs md:text-base whitespace-pre-wrap break-words overflow-hidden">
                              {summary.conclude}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendees */}
              {note.attendees && note.attendees.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6 rounded-2xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="w-5 h-5 text-white"
                      />
                    </div>
                    <div>
                      <h2 className="md:text-xl font-bold text-gray-900">
                        Attendees
                      </h2>
                      <h2 className="text-xs md:text-sm font-light text-gray-600">
                        ผู้เข้าร่วมประชุม
                      </h2>
                    </div>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                      {note.attendees.length} คน
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {note.attendees.map((attendee, index) => (
                      <div
                        key={index}
                        className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 ${
                          attendee.role === "ลูกค้า"
                            ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            attendee.role === "ลูกค้า"
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {attendee.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm md:text-base">
                            {attendee.name}
                          </div>
                          <div
                            className={`text-xs ${
                              attendee.role === "ลูกค้า"
                                ? "text-white/70"
                                : "text-gray-500"
                            }`}
                          >
                            {attendee.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Attachments */}
              {note.noteAttachment && note.noteAttachment.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        className="w-5 h-5 text-white"
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      ไฟล์แนบ PDF
                    </h2>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                      {note.noteAttachment.length} ไฟล์
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {note.noteAttachment.map((file, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-orange-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <FontAwesomeIcon
                              icon={faFilePdf}
                              className="w-6 h-6 text-red-600"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-800 hover:text-orange-600 font-medium block truncate transition-colors"
                            >
                              {file.name}
                            </a>
                            <p className="text-xs text-gray-500 mt-1">
                              คลิกเพื่อเปิดไฟล์
                            </p>
                          </div>
                          <FontAwesomeIcon
                            icon={faExternalLinkAlt}
                            className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-6 pt-8 border-t-2 border-gray-200 mt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[120px]"
                >
                  <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                  Edit (แก้ไข)
                </button>

                <div className="min-w-[120px] flex justify-center">
                  <ExportPDFButton note={note} />
                </div>

                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[120px]"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  Delete (ลบ)
                </button>
              </div>

              {/* Share Section */}
              <div className="mt-8">
                <ShareButton note={note} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
