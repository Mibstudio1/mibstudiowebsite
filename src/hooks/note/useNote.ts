"use client";
import { labelMap } from "@/constants/createNote";
import { createNoteSchema } from "@/schema/frontend/createNote";
import { POST, POST_CREATE_NOTE, POST_NOTE } from "@/services/route";
import { RootState } from "@/store/store";
import { Data } from "@/type/createNoteType";
import { Note } from "@/type/noteType";
import { renderZodErrors } from "@/utils/fn";
import { uploadFiles } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";

interface SearchNote {
  search?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}

export const useNote = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState("");
  const [note, setNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<{
    project: string;
    title: string;
    date: string;
    attendees: { role: string; name: string }[];
    details: { name: string; description: string }[];
    summaries: { topic: string; conclude: string }[];
    pdfs: (File | { name: string; url: string; isExisting?: boolean })[];
  }>({
    project: "",
    title: "",
    date: "",
    attendees: [{ role: "พนักงาน", name: "" }],
    details: [{ name: "", description: "" }],
    summaries: [{ topic: "", conclude: "" }],
    pdfs: [],
  });

  const createNote = async (data: Data) => {
    try {
      const { project, title, date, attendees, details, summaries, pdfs } =
        data;
      const newFiles = pdfs.filter(
        (file): file is File => file instanceof File
      );
      const fullPath = await uploadFiles(newFiles);
      const expandNote = details.map((detail) => {
        const summary = summaries.find((s) => s.topic === detail.name);
        return {
          name: detail.name || "",
          description: detail.description || "",
          conclude: summary ? summary.conclude || "" : "",
        };
      });

      const newObj = {
        customerId: user?.customerId,
        project,
        title,
        date,
        attendees,
        noteExpand: expandNote,
        noteAttachment: fullPath,
      };

      const {
        success: ss,
        data: dt,
        error,
      } = createNoteSchema.safeParse(newObj);
      if (!ss) {
        const errMsg = renderZodErrors(error, labelMap);
        alert(errMsg);
        return { success: false };
      }

      const response: { success: boolean; result?: any } = await POST(
        POST_CREATE_NOTE,
        dt
      );

      const { success } = response;
      if (!success) {
        return { success };
      }

      return { success };
    } catch (error: any) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาด");
      throw error;
    }
  };
  const fetchNotes = useCallback(
    async ({ search, startDate, endDate }: SearchNote) => {
      if (!user?.customerId) {
        setError("ยังไม่ได้เข้าสู่ระบบ");
        return;
      }
      setIsLoading(true);
      try {
        const newObj = {
          customerId: user.customerId,
          title: search,
          startDate,
          endDate,
        };

        const response: { success: boolean; result: any } = await POST(
          POST_NOTE,
          newObj
        );
        const { success, result } = response;

        if (!success) {
          setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
          return { success };
        }
        setNotes(result);
      } catch (error) {
        console.error("Fetch failed:", error);
        alert("เกิดข้อผิดพลาด");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.customerId]
  );
  const deleteNote = async (id: number) => {
    try {
      const response = await fetch("/api/note", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId: id }),
      });

      const result = await response.json();
      const { success } = result;

      if (!success) {
        setError("ไม่สามารถลบบันทึกได้");
        return { success };
      }
      return { success };
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert("เกิดข้อผิดพลาดในการลบบันทึก");
      throw error;
    }
  };

  const fetchNote = async ({ params }: { params: { id: string } }) => {
    setIsLoading(true);
    try {
      if (!user) {
        return;
      }

      if (!user?.customerId) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: user.customerId,
          title: "",
          startDate: "",
          endDate: "",
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (!data.result || !Array.isArray(data.result)) {
          setNote(null);
          return;
        }

        const validNotes = data.result.filter((n: any) => {
          return (
            n && typeof n === "object" && n.hasOwnProperty("id") && n.id != null
          );
        });

        let foundNote: Note | undefined;
        try {
          foundNote = validNotes.find((n: any) => {
            try {
              return n && n.id && n.id.toString() === params.id;
            } catch (err) {
              console.error("Error in find callback:", err, "for note:", n);
              return false;
            }
          });
        } catch (err) {
          console.error("Error in find method:", err);
          foundNote = undefined;
        }

        if (foundNote) {
          setNote(foundNote);
          setFormData({
            project: foundNote.project || "",
            title: foundNote.title || "",
            date:
              foundNote.createDate ||
              new Date(foundNote.createDate).toISOString().split("T")[0],
            attendees:
              foundNote.attendees?.length > 0
                ? foundNote.attendees
                : [{ role: "พนักงาน", name: "" }],
            details:
              foundNote.noteExpand?.length > 0
                ? foundNote.noteExpand.map((item) => ({
                    name: item.name || "",
                    description: item.description || "",
                  }))
                : [{ name: "", description: "" }],
            summaries:
              foundNote.noteExpand?.length > 0
                ? foundNote.noteExpand.map((item) => ({
                    topic: item.name || "",
                    conclude: item.conclude || "",
                  }))
                : [{ topic: "", conclude: "" }],
            pdfs:
              foundNote.noteAttachment?.length > 0
                ? foundNote.noteAttachment.map((file: any) => ({
                    name: file.name,
                    url: file.url,
                    isExisting: true,
                  }))
                : [],
          });
        } else {
          console.error("Note not found with ID:", params.id);
          setNote(null);
        }
      } else {
        console.error("Failed to fetch notes");
        setNote(null);
      }
    } catch (error) {
      console.error("Error fetching note:", error);
      setNote(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createNote,
    fetchNotes,
    isLoading,
    notes,
    error,
    deleteNote,
    user,
    fetchNote,
    formData,
    note,
    setFormData,
  };
};
