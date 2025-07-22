"use client";

import React, { useState, useRef, useEffect } from "react";
import { Note } from "@/type/noteType";
import { exportNoteToPDF } from "@/utils/pdfExport";
import { mergePDFsAndCreateShareableURL } from "@/utils/pdfMerger";

interface ExportPDFButtonProps {
  note: Note;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ note }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 400;

      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExportReportOnly = async () => {
    setIsExporting(true);
    setShowDropdown(false);

    try {
      await exportNoteToPDF(note);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("ไม่สามารถสร้างไฟล์ PDF ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWithAttachments = async () => {
    setIsExporting(true);
    setShowDropdown(false);

    try {
      const mergedPdfUrl = await mergePDFsAndCreateShareableURL(note);

      const link = document.createElement("a");
      link.href = mergedPdfUrl;
      link.download = `รายงานการประชุม_รวมไฟล์แนบ_${note.title}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(mergedPdfUrl);
      }, 1000);
    } catch (error) {
      console.error("Error exporting merged PDF:", error);
      alert("ไม่สามารถสร้างไฟล์ PDF รวมไฟล์แนบได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsExporting(false);
    }
  };

  const hasAttachments = note.noteAttachment && note.noteAttachment.length > 0;
  const pdfAttachments =
    note.noteAttachment?.filter((file) =>
      file.name.toLowerCase().endsWith(".pdf")
    ) || [];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ปุ่มหลัก */}
      <button
        ref={buttonRef}
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            กำลัง Export...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export PDF
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div
          className={`absolute left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] overflow-hidden min-w-[320px] ${
            dropdownPosition === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          }`}
        >
          {/* Export รายงานอย่างเดียว */}
          <button
            onClick={handleExportReportOnly}
            className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-base">
                รายงานการประชุมเท่านั้น
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Export เฉพาะรายงานที่สร้างจากระบบ
              </div>
            </div>
          </button>

          {/* Export รวมไฟล์แนบ */}
          <button
            onClick={handleExportWithAttachments}
            disabled={!hasAttachments}
            className={`w-full px-6 py-4 text-left transition-colors flex items-center gap-3 ${
              hasAttachments
                ? "hover:bg-gray-50"
                : "opacity-50 cursor-not-allowed bg-gray-50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                hasAttachments ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  hasAttachments ? "text-green-600" : "text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div
                className={`font-medium text-base ${
                  hasAttachments ? "text-gray-900" : "text-gray-400"
                }`}
              >
                รายงาน + ไฟล์แนบ PDF
              </div>
              <div
                className={`text-sm mt-1 ${
                  hasAttachments ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {hasAttachments
                  ? `รวมไฟล์แนบ ${note.noteAttachment?.length} ไฟล์`
                  : "ไม่มีไฟล์ PDF แนบ"}
              </div>
            </div>
          </button>

          {/* แสดงรายการไฟล์แนบ PDF */}
          {hasAttachments && pdfAttachments.length > 0 && (
            <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-blue-800">
                  ไฟล์ PDF ที่จะรวม:
                </span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {pdfAttachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm text-blue-700 bg-white px-3 py-2 rounded-lg border border-blue-200"
                  >
                    <svg
                      className="w-4 h-4 text-blue-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* หมายเหตุ */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">หมายเหตุ:</p>
                <p className="mb-1">
                  • รายงานเท่านั้น: ไฟล์ขนาดเล็ก เหมาะสำหรับการแชร์
                </p>
                <p className="mb-1">
                  • รวมไฟล์แนบ: ไฟล์ขนาดใหญ่ แต่ครบถ้วนสมบูรณ์
                </p>
                {hasAttachments && <p>• จะรวมไฟล์ PDF ที่แนบมาไว้ท้ายรายงาน</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPDFButton;
