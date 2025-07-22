import { z } from "zod";

export const createNoteSchema = z.object({
  project: z.string().min(1, "กรุณาระบุชื่อโปรเจค"),
  customerId: z.string().min(1, "กรุณาระบุรหัสลูกค้า"),
  title: z.string().min(1, "กรุณาระบุหัวข้อการประชุม"),
  date: z.string().min(1, "กรุณาระบุวันที่"),
  attendees: z
    .array(
      z.object({
        role: z.string().min(1, "กรุณาระบุบทบาท"),
        name: z.string().min(1, "กรุณาระบุชื่อผู้เข้าร่วม"),
      })
    )
    .min(1, "ต้องมีผู้เข้าร่วมอย่างน้อย 1 คน"),
  noteExpand: z
    .array(
      z.object({
        name: z.string().nullable().optional(),
        description: z.string().min(1, "กรุณาระบุรายละเอียด"),
        conclude: z.string().nullable().optional(),
      })
    )
    .min(1, "ต้องมีรายละเอียดอย่างน้อย 1 รายการ"),
  noteAttachment: z
    .array(
      z.object({
        name: z.string().min(1, "กรุณาระบุชื่อไฟล์แนบ"),
        url: z.string().min(1, "กรุณาระบุลิงก์ไฟล์แนบ"),
      })
    )
    .optional()
    .default([]),
});
