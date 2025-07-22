import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/utils/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const groupFile = formData.get("groupFile") as string;
    const fileName = formData.get("fileName") as string;

    if (!file || !groupFile || !fileName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert file to base64 for storage
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Save to database
    const savedPdf = await prisma.uploadPDF.create({
      data: {
        name: fileName,
        group_file: groupFile,
        file_data: base64, // Assuming you'll add this field to schema
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: savedPdf.id,
        name: savedPdf.name,
        groupFile: savedPdf.group_file,
        uploadDate: savedPdf.uploadDate,
      },
    });
  } catch (error) {
    console.error("Upload PDF error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pdfs = await prisma.uploadPDF.findMany({
      orderBy: {
        uploadDate: 'desc'
      }
    });

    const grouped: Record<string, { 
      groupFile: string; 
      files: Array<{
        id: number;
        name: string;
        uploadDate: Date;
      }> 
    }> = {};

    pdfs.forEach((pdf) => {
      const category = pdf.group_file;
      if (!grouped[category]) {
        grouped[category] = {
          groupFile: pdf.group_file,
          files: [],
        };
      }
      grouped[category].files.push({
        id: pdf.id,
        name: pdf.name,
        uploadDate: pdf.uploadDate,
      });
    });

    return NextResponse.json({
      success: true,
      data: Object.values(grouped),
    });
  } catch (error) {
    console.error("Get PDFs error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 