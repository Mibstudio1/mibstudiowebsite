import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "PDF ID is required" },
        { status: 400 }
      );
    }

    const pdfId = parseInt(id);
    if (isNaN(pdfId)) {
      return NextResponse.json(
        { success: false, error: "Invalid PDF ID" },
        { status: 400 }
      );
    }

    // Get PDF from database
    const pdf = await prisma.uploadPDF.findUnique({
      where: { id: pdfId }
    });

    if (!pdf) {
      return NextResponse.json(
        { success: false, error: "PDF not found" },
        { status: 404 }
      );
    }

    if (!pdf.file_data) {
      return NextResponse.json(
        { success: false, error: "PDF file data not found" },
        { status: 404 }
      );
    }

    // Convert base64 back to buffer
    const fileBuffer = Buffer.from(pdf.file_data, 'base64');

    // Return PDF file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(pdf.name)}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download PDF error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 