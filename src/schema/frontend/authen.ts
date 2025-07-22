import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อผู้ใช้งาน"),
  company: z.string().min(1, "กรุณากรอกชื่อบริษัท"),
  phone: z
    .string()
    .min(10, "กรุณากรอกเบอร์โทร 10 หลัก")
    .max(10, "กรุณากรอกเบอร์โทร 10 หลัก")
    .regex(/^\d+$/, "เบอร์โทรต้องเป็นตัวเลขเท่านั้น"),
  address: z.string().min(1, "กรุณากรอกที่อยู่"),
});

export const loginSchema = z.object({
  customerId: z.string().min(1, "กรุณากรอกรหัสลูกค้า"),
});
