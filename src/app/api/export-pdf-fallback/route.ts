import { NextResponse } from "next/server";
import jsPDF from "jspdf";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { htmlContent } = data;

    console.log("Using jsPDF fallback for PDF generation...");

    if (!htmlContent) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    // Create a new PDF document
    const doc = new jsPDF();
    
    // Set font for Thai support (using default font for now)
    doc.setFont("helvetica");
    doc.setFontSize(12);
    
    // Simple text extraction and rendering
    const textContent = htmlContent
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    // Split text into lines that fit the page
    const lines = doc.splitTextToSize(textContent, 180);
    
    let y = 20;
    lines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 15, y);
      y += 7;
    });

    // Get PDF as buffer
    const pdfBuffer = doc.output('arraybuffer');
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    console.log("PDF generated with jsPDF, size:", pdfUint8Array.length);

    // Return PDF as response
    return new NextResponse(pdfUint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=project-proposal-fallback.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating PDF with jsPDF:", error);
    
    return NextResponse.json(
      { 
        error: `Failed to generate PDF with jsPDF: ${error}`,
        details: {
          environment: process.env.NODE_ENV,
          vercel: process.env.VERCEL,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
} 