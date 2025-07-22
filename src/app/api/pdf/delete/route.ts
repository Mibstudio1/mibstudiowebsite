import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function DELETE(request: NextRequest) {
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

    // Check if PDF exists
    const existingPdf = await prisma.uploadPDF.findUnique({
      where: { id: pdfId },
    });

    if (!existingPdf) {
      return NextResponse.json(
        { success: false, error: "PDF not found" },
        { status: 404 }
      );
    }

    // Delete PDF
    await prisma.uploadPDF.delete({
      where: { id: pdfId },
    });

    return NextResponse.json({
      success: true,
      message: "PDF deleted successfully",
      data: {
        id: existingPdf.id,
        name: existingPdf.name,
        groupFile: existingPdf.group_file,
      },
    });
  } catch (error) {
    console.error("Delete PDF error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
