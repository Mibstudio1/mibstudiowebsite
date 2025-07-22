"use client";

import React, { useState } from "react";
import { Note } from "@/type/noteType";
import {
  generatePDFBlob,
} from "@/utils/pdfMerger";

interface ShareButtonProps {
  note: Note;
}

const ShareButton: React.FC<ShareButtonProps> = ({ note }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleGenerateShareFile = async () => {
    setIsLoading(true);
    try {
      const pdfBlob = await generatePDFBlob(note);
      setShowShareOptions(true);

      (window as any).currentPdfBlob = pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("ไม่สามารถสร้างไฟล์ PDF ได้");
    } finally {
      setIsLoading(false);
    }
  };

  const shareTitle = `รายงานการประชุม: ${note.title}`;
  const shareDescription = `รายงานการประชุมวันที่ ${new Date(
    note.createDate
  ).toLocaleDateString("th-TH")}`;

  const handleShare = async () => {
    try {
      const pdfBlob = (window as any).currentPdfBlob;
      if (!pdfBlob) {
        alert("กรุณาเตรียมไฟล์ก่อน");
        return;
      }

      const file = new File([pdfBlob], `${note.title}.pdf`, {
        type: "application/pdf",
      });

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareDescription,
            files: [file],
          });
        } catch (shareError) {
          if (shareError instanceof Error) {
            if (shareError.name === "AbortError") {
              return;
            } else if (shareError.name === "InvalidStateError") {
              setTimeout(async () => {
                try {
                  await navigator.share({
                    title: shareTitle,
                    text: shareDescription,
                    files: [file],
                  });
                } catch (retryError) {
                  console.error("Retry share failed:", retryError);
                  fallbackToDownload(pdfBlob);
                }
              }, 1000);
              return;
            } else {
              console.error("Share failed:", shareError);
              fallbackToDownload(pdfBlob);
            }
          } else {
            console.error("Unknown share error:", shareError);
            fallbackToDownload(pdfBlob);
          }
        }
      } else {
        fallbackToDownload(pdfBlob);
      }
    } catch (error) {
      console.error("Error in handleShare:", error);
      alert("ไม่สามารถแชร์ได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const fallbackToDownload = (pdfBlob: Blob) => {
    try {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${note.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert("ดาวน์โหลดไฟล์แล้ว กรุณาแชร์ไฟล์ด้วยตนเอง");
    } catch (error) {
      console.error("Fallback download failed:", error);
      alert("ไม่สามารถดาวน์โหลดไฟล์ได้");
    }
  };

  return (
    <div className="space-y-6">
      {/* ปุ่มสร้างไฟล์ PDF */}
      <div className="text-center">
        <button
          onClick={handleGenerateShareFile}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              กำลังสร้างไฟล์ PDF...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
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
              Create PDF (สร้างไฟล์ PDF สำหรับแชร์)
            </>
          )}
        </button>
      </div>

      {/* ตัวเลือกการแชร์ */}
      {showShareOptions && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              แชร์รายงานการประชุม
            </h3>
            <p className="text-sm text-gray-600">
              คลิกปุ่มด้านล่างเพื่อแชร์ไฟล์ PDF
            </p>
          </div>

          {/* ปุ่มแชร์หลัก */}
          <div className="text-center">
            <button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              แชร์ไฟล์ PDF
            </button>
          </div>

          {/* หมายเหตุ */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
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
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">หมายเหตุ:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>ไฟล์ PDF รวมรายงานการประชุมและไฟล์แนบทั้งหมด</li>
                  <li>ระบบจะแสดงตัวเลือกการแชร์ให้เลือกเอง</li>
                  <li>รองรับการแชร์ผ่าน WhatsApp, Email, และแอปอื่นๆ</li>
                  <li>หากแชร์ไม่ได้ จะดาวน์โหลดไฟล์ให้แทน</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
