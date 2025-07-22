"use client";
import React, { useState } from "react";
import PdfUpload from "./PdfUpload";
import TopicData from "./TopicData";
import Attendees from "./Attendees";
import Details from "./Details";
import Summary from "./Summary";
import { useNote } from "@/hooks/note/useNote";
import { useRouter } from "next/navigation";

const CreateNoteForm = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    project: "",
    title: "",
    date: "",
    attendees: [{ role: "พนักงาน", name: "" }],
    details: [{ name: "", description: "" }],
    summaries: [{ topic: "", conclude: "" }],
    pdfs: [],
  });

  const { createNote } = useNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { success } = await createNote(data);
      if (!success) {
        alert("ไม่สามารถสร้างบันทึกได้ โปรดตรวจสอบข้อมูลและลองอีกครั้ง");
        setIsSaving(false);
        return;
      }

      alert("บันทึกรายงานเรียบร้อยแล้ว");
      setIsSaving(false);
      router.push("/notes");
    } catch (error) {
      console.error("Error creating note:", error);
      alert("เกิดข้อผิดพลาดในการสร้างบันทึก กรุณาลองใหม่อีกครั้ง");
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "คุณต้องการยกเลิกการกรอกฟอร์มหรือไม่? ข้อมูลที่กรอกไว้จะหายไป"
    );
    if (confirmCancel) {
      router.push("/notes");
    }
  };

  return (
    <form
      className="bg-white border-2 border-gray-200 p-0 md:p-8 rounded-b-2xl space-y-8 shadow-xl"
      onSubmit={handleSubmit}
    >
      <TopicData data={data} setData={setData} />
      <Attendees data={data} setData={setData} />
      <Details data={data} setData={setData} />
      <Summary data={data} setData={setData} />
      <PdfUpload data={data} setData={setData} />
      <div className="text-center mt-8 pt-6 border-t-2 border-gray-200">
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl px-2 md:px-8 py-4 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            ยกเลิกฟอร์ม
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white rounded-xl px-4 md:px-12 py-4 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={isSaving}
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกรายงาน"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateNoteForm;
