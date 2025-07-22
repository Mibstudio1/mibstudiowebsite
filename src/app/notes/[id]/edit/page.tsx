"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useNote } from "@/hooks/note/useNote";
import TopicData from "@/components/createNote/TopicData";
import Attendees from "@/components/createNote/Attendees";
import Details from "@/components/createNote/Details";
import Summary from "@/components/createNote/Summary";
import PdfUpload from "@/components/createNote/PdfUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const router = useRouter();
  const { id } = use(params);

  const { fetchNote, note, formData, isLoading, setFormData, user } = useNote();

  useEffect(() => {
    if (user?.customerId) {
      fetchNote({ params: { id } });
    }
  }, [id, user?.customerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/note/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(id),
          title: formData.title,
          date: formData.date,
          attendees: formData.attendees,
          noteExpand: formData.details.map((detail, index) => ({
            name: detail.name,
            description: detail.description,
            conclude: formData.summaries[index]?.conclude || "",
          })),
          noteAttachment: await (async () => {
            const newFiles = formData.pdfs.filter(
              (file: any) => file instanceof File
            );

            const uploadedFiles =
              newFiles.length > 0 ? await uploadFiles(newFiles) : [];

            const existingFiles =
              note?.noteAttachment?.filter(
                (file) => !filesToDelete.includes(file.name)
              ) || [];

            return [...existingFiles, ...uploadedFiles];
          })(),
        }),
      });

      if (response.ok) {
        if (filesToDelete.length > 0) {
          await deleteFilesFromStorage(filesToDelete);
        }

        alert("บันทึกการแก้ไขเรียบร้อยแล้ว");
        router.push(`/notes/${id}`);
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return [];

    try {
      const { uploadFiles: uploadFilesUtil } = await import("@/utils/supabase");
      return await uploadFilesUtil(files);
    } catch (error) {
      console.error("File upload failed:", error);
      return [];
    }
  };

  const deleteFilesFromStorage = async (filesToDelete: string[]) => {
    if (filesToDelete.length === 0) return;

    try {
      const { deleteFiles } = await import("@/utils/supabase");
      const results = await deleteFiles(filesToDelete);

      results.forEach((result) => {
        if (!result.success) {
          console.warn(
            `Failed to delete file ${result.fileName}:`,
            result.error
          );
        }
      });
    } catch (error) {
      console.error("File deletion failed:", error);
    }
  };

  const handleBack = () => {
    router.push(`/notes/${id}`);
  };

  const handleDeleteExistingFile = (fileName: string) => {
    if (confirm(`คุณต้องการลบไฟล์ "${fileName}" หรือไม่?`)) {
      setFilesToDelete((prev) => [...prev, fileName]);
    }
  };

  const handleCancelDeleteFile = (fileName: string) => {
    setFilesToDelete((prev) => prev.filter((name) => name !== fileName));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">
            ไม่พบข้อมูลบันทึกการประชุม
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          ← กลับไปดูรายละเอียด
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-black rounded-t-2xl px-6 py-4 text-xl font-bold text-white shadow-lg">
          แก้ไขบันทึกการประชุม
        </div>

        {/* Edit Form */}
        <form
          className="bg-white border-2 border-gray-200 p-8 rounded-b-2xl space-y-8 shadow-xl"
          onSubmit={handleSubmit}
        >
          <TopicData data={formData} setData={setFormData} />
          <Attendees data={formData} setData={setFormData} />
          <Details data={formData} setData={setFormData} />
          <Summary data={formData} setData={setFormData} />
          <PdfUpload data={formData} setData={setFormData} />

          {/* Show existing PDF files info */}
          {note?.noteAttachment && note.noteAttachment.length > 0 && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                ไฟล์ PDF ที่มีอยู่เดิม ({note.noteAttachment.length} ไฟล์)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {note.noteAttachment
                  .filter((file) => !filesToDelete.includes(file.name))
                  .map((file, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 font-medium truncate">
                          {file.name}
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          ดูไฟล์
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingFile(file.name)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                        title="ลบไฟล์"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                ไฟล์เหล่านี้จะยังคงอยู่ในการบันทึก
                คุณสามารถเพิ่มไฟล์ใหม่ได้ด้านบน หรือลบไฟล์ที่ไม่ต้องการได้
              </p>
              {filesToDelete.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">
                    ไฟล์ที่จะถูกลบ ({filesToDelete.length} ไฟล์):
                  </p>
                  <ul className="mt-2 space-y-1">
                    {filesToDelete.map((fileName, index) => (
                      <li
                        key={index}
                        className="text-sm text-red-600 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          {fileName}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCancelDeleteFile(fileName)}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          ยกเลิกการลบ
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8 pt-6 border-t-2 border-gray-200">
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-xl px-2 md:px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSaving}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white rounded-xl px-4 md:px-12 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={isSaving}
              >
                {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
