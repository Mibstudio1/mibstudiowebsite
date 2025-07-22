import { prisma } from "@/utils/db";
import { ZodError } from "zod";

function generateRandomString(length = 6) {
  const chars = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateUniqueCustomerId(): Promise<string> {
  while (true) {
    const randomStr = generateRandomString(6);
    const id = `CUS_${randomStr}`;
    const exists = await prisma.customer.findUnique({
      where: { customerId: id },
    });
    if (!exists) {
      return id;
    }
  }
}

type LabelMap = Record<string, string>;

export function renderZodErrors(error: ZodError, labelMap: LabelMap): string {
  return error.issues
    .map((issue) => {
      const key =
        Array.isArray(issue.path) && issue.path.length > 0
          ? issue.path[0]
          : undefined;
      let label: string;
      if (typeof key === "string" && labelMap[key]) {
        label = labelMap[key];
      } else if (typeof key === "string") {
        label = key;
      } else if (typeof key === "symbol") {
        label = "ข้อมูล";
      } else {
        label = "ข้อมูล";
      }
      return `${label}: ${issue.message}`;
    })
    .join("\n");
}
