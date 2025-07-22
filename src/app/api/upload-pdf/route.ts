import { NextResponse } from "next/server";
import {prisma} from "@/utils/db";

export async function GET() {
  try {
    const pdfs = await (prisma as any).uploadPDF.findMany();
    const grouped: Record<string, { url: string[]; groupFile: string }> = {};
    pdfs.forEach((e: any) => {
      const cat = e.group_file;
      if (!grouped[cat]) {
        grouped[cat] = {
          groupFile: e.group_file,
          url: [],
        };
      }
      grouped[cat].url.push(e.name);
    });
    const respone = Object.values(grouped);
    return NextResponse.json({ success: true, data: respone });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
