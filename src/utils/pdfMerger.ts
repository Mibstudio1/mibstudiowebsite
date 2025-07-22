import { PDFDocument } from "pdf-lib";
import { Note } from "@/type/noteType";

// ค่าคงที่ขนาด A4
const A4_WIDTH = 595.276; // A4 width in points
const A4_HEIGHT = 841.89; // A4 height in points

// ฟังก์ชันสำหรับปรับขนาดหน้าทุกหน้าให้เท่ากับ A4 และปรับเนื้อหาให้พอดี
const resizePagesToA4 = async (pages: any[], mergedPdf: any) => {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const originalWidth = page.getWidth();
    const originalHeight = page.getHeight();

    // คำนวณอัตราส่วนการปรับขนาด
    const scaleX = A4_WIDTH / originalWidth;
    const scaleY = A4_HEIGHT / originalHeight;
    const scale = Math.min(scaleX, scaleY); // ใช้ค่าที่เล็กกว่าเพื่อไม่ให้เนื้อหาถูกตัด

    // สร้างหน้า A4 ใหม่
    const newPage = mergedPdf.addPage([A4_WIDTH, A4_HEIGHT]);

    // ใช้ embedPages แทน copyPages
    const [embeddedPage] = await mergedPdf.embedPages([page]);

    // คำนวณขนาดและตำแหน่งที่จะวาดเนื้อหา
    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;
    const offsetX = (A4_WIDTH - scaledWidth) / 2;
    const offsetY = (A4_HEIGHT - scaledHeight) / 2;

    // วาดเนื้อหาลงในหน้าใหม่
    newPage.drawPage(embeddedPage, {
      x: offsetX,
      y: offsetY,
      width: scaledWidth,
      height: scaledHeight,
    });
  }
};

// ฟังก์ชันสำหรับปรับขนาดหน้าเดียวให้เป็น A4 (ใช้ซ้ำได้)
export const resizePageToA4 = async (page: any, mergedPdf: any) => {
  const originalWidth = page.getWidth();
  const originalHeight = page.getHeight();

  // คำนวณอัตราส่วนการปรับขนาด
  const scaleX = A4_WIDTH / originalWidth;
  const scaleY = A4_HEIGHT / originalHeight;
  const scale = Math.min(scaleX, scaleY, 1); // ใช้ค่าที่เล็กกว่าและไม่เกิน 1

  // สร้างหน้า A4 ใหม่
  const newPage = mergedPdf.addPage([A4_WIDTH, A4_HEIGHT]);

  // คัดลอกเนื้อหาจากหน้าเดิม
  const [copiedPage] = await mergedPdf.copyPages([page], [0]);

  // คำนวณขนาดและตำแหน่งที่จะวาดเนื้อหา
  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;
  const offsetX = (A4_WIDTH - scaledWidth) / 2;
  const offsetY = (A4_HEIGHT - scaledHeight) / 2;

  // วาดเนื้อหาลงในหน้าใหม่
  newPage.drawPage(copiedPage, {
    x: offsetX,
    y: offsetY,
    width: scaledWidth,
    height: scaledHeight,
  });

  return newPage;
};

export const mergePDFsAndCreateShareableURL = async (
  note: Note
): Promise<string> => {
  try {
    // สร้าง PDF ใหม่จากข้อมูลการประชุม
    const reportPdfBytes = await generateReportPDFBytes(note);

    // สร้าง PDFDocument ใหม่สำหรับรวม PDF
    const mergedPdf = await PDFDocument.create();

    // เพิ่ม PDF รายงานการประชุม
    const reportPdf = await PDFDocument.load(reportPdfBytes);
    const reportPages = await mergedPdf.copyPages(
      reportPdf,
      reportPdf.getPageIndices()
    );
    reportPages.forEach((page) => mergedPdf.addPage(page));

    // เพิ่ม PDF ที่แนบมา (ถ้ามี)
    if (note.noteAttachment && note.noteAttachment.length > 0) {
      for (const attachment of note.noteAttachment) {
        if (attachment.name.toLowerCase().endsWith(".pdf")) {
          try {
            // ดาวน์โหลด PDF ที่แนบมา
            const response = await fetch(attachment.url);
            const attachmentBytes = await response.arrayBuffer();

            // รวม PDF ที่แนบมา
            const attachmentPdf = await PDFDocument.load(attachmentBytes);
            const attachmentPages = await mergedPdf.copyPages(
              attachmentPdf,
              attachmentPdf.getPageIndices()
            );

            // ปรับขนาดหน้าทุกหน้าให้เท่ากับ A4 และรักษาเนื้อหา
            await resizePagesToA4(attachmentPages, mergedPdf);
          } catch (error) {
            console.error(
              `Error loading attachment PDF: ${attachment.name}`,
              error
            );
          }
        }
      }
    }

    // สร้าง PDF ที่รวมแล้ว
    const mergedPdfBytes = await mergedPdf.save();

    // สร้าง Blob และ URL
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.error("Error merging PDFs:", error);
    throw new Error("ไม่สามารถรวม PDF ได้");
  }
};

// ฟังก์ชันใหม่สำหรับสร้าง PDF blob สำหรับการแชร์
export const generatePDFBlob = async (note: Note): Promise<Blob> => {
  try {
    // สร้าง PDF ใหม่จากข้อมูลการประชุม
    const reportPdfBytes = await generateReportPDFBytes(note);

    // สร้าง PDFDocument ใหม่สำหรับรวม PDF
    const mergedPdf = await PDFDocument.create();

    // เพิ่ม PDF รายงานการประชุม
    const reportPdf = await PDFDocument.load(reportPdfBytes);
    const reportPages = await mergedPdf.copyPages(
      reportPdf,
      reportPdf.getPageIndices()
    );
    reportPages.forEach((page) => mergedPdf.addPage(page));

    // เพิ่ม PDF ที่แนบมา (ถ้ามี)
    if (note.noteAttachment && note.noteAttachment.length > 0) {
      for (const attachment of note.noteAttachment) {
        if (attachment.name.toLowerCase().endsWith(".pdf")) {
          try {
            // ดาวน์โหลด PDF ที่แนบมา
            const response = await fetch(attachment.url);
            const attachmentBytes = await response.arrayBuffer();

            // รวม PDF ที่แนบมา
            const attachmentPdf = await PDFDocument.load(attachmentBytes);
            const attachmentPages = await mergedPdf.copyPages(
              attachmentPdf,
              attachmentPdf.getPageIndices()
            );

            // ปรับขนาดหน้าทุกหน้าให้เท่ากับ A4 และรักษาเนื้อหา
            await resizePagesToA4(attachmentPages, mergedPdf);
          } catch (error) {
            console.error(
              `Error loading attachment PDF: ${attachment.name}`,
              error
            );
          }
        }
      }
    }

    // สร้าง PDF ที่รวมแล้ว
    const mergedPdfBytes = await mergedPdf.save();

    // สร้างและ return Blob
    return new Blob([mergedPdfBytes], { type: "application/pdf" });
  } catch (error) {
    console.error("Error generating PDF blob:", error);
    throw new Error("ไม่สามารถสร้างไฟล์ PDF ได้");
  }
};

// ฟังก์ชันสำหรับสร้าง PDF bytes จากข้อมูลการประชุม
const generateReportPDFBytes = async (note: Note): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    // สร้าง PDF ชั่วคราวและแปลงเป็น ArrayBuffer
    // เนื่องจาก exportNoteToPDF ใช้ jsPDF.save() เราต้องแก้ไขให้ return bytes

    // วิธีแก้ไข: สร้างฟังก์ชันใหม่ที่ return PDF bytes แทนการ save
    generateReportPDFBytesInternal(note).then(resolve).catch(reject);
  });
};

// ฟังก์ชันภายในสำหรับสร้าง PDF bytes
const generateReportPDFBytesInternal = async (
  note: Note
): Promise<ArrayBuffer> => {
  // Import dynamic เพื่อหลีกเลี่ยงปัญหา SSR
  const jsPDF = (await import("jspdf")).default;

  // โหลดฟอนต์และโลโก้
  const [fontData, logoData] = await Promise.all([loadThaiFont(), loadLogo()]);

  // สร้าง PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
    compress: true,
  });

  // เพิ่มฟอนต์ไทยใน PDF
  addThaiFont(doc, fontData);

  let yPosition = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;

  // สีสำหรับการตกแต่ง
  const primaryColor = [17, 17, 17] as [number, number, number];
  const secondaryColor = [108, 117, 125] as [number, number, number];
  const underlineColor = [128, 128, 128] as [number, number, number]; // Gray for underlines

  // ฟังก์ชันสำหรับเพิ่มข้อความที่รองรับภาษาไทย
  const addThaiText = (text: string, x: number, y: number, options?: any) => {
    const processedText = text.normalize("NFC");
    if (options) {
      doc.text(processedText, x, y, options);
    } else {
      doc.text(processedText, x, y);
    }
  };

  // ฟังก์ชันสำหรับแบ่งข้อความที่รองรับภาษาไทย
  const splitThaiText = (text: string, maxWidth: number) => {
    if (!text || text.trim() === "") return [""];

    const processedText = text.normalize("NFC");

    try {
      // ลองใช้ splitTextToSize ก่อน
      const lines = doc.splitTextToSize(processedText, maxWidth);

      // ตรวจสอบว่าผลลัพธ์ถูกต้องหรือไม่
      if (lines && lines.length > 0) {
        return lines;
      }
    } catch (error) {
      console.error("Error in splitTextToSize, using manual split:", error);
    }

    // ถ้า splitTextToSize ไม่ทำงาน ใช้วิธีแบ่งด้วยตนเอง
    const words = processedText.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const testWidth = doc.getTextWidth(testLine);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [processedText];
  };

  // ฟังก์ชันตรวจสอบและเพิ่มหน้าใหม่
  const checkAndAddPage = (requiredSpace: number = 30) => {
    if (yPosition + requiredSpace > pageHeight - 40) {
      addPageHeader();
      return true;
    }
    return false;
  };

  // ฟังก์ชันสำหรับเพิ่ม header ในหน้าใหม่
  const addPageHeader = () => {
    doc.addPage();

    // พื้นหลังสีดำสำหรับ header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 25, "F");

    // เพิ่มโลโก้ (ถ้ามี)
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", margin, 2, 18, 18);
      } catch (error) {
        console.error("Could not add logo:", error);
      }
    }

    // ข้อมูลบริษัท
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("NotoSerifThai", "normal");

    const companyInfo = [
      "107/65 ม.1 ต.มะเร็ต อ.เกาะสมุย",
      "จ.สุราษฏร์ธานี 84310",
      "โทร 0947495654",
    ];

    companyInfo.forEach((info, index) => {
      addThaiText(info, margin + 22, 8 + index * 4);
    });

    yPosition = 35;
  };

  // สร้างเนื้อหา PDF (ใช้โค้ดเดียวกับ exportNoteToPDF)
  // Company Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 25, "F");

  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", margin, 2, 18, 18);
    } catch (error) {
      console.error("Could not add logo:", error);
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("NotoSerifThai", "normal");

  const companyInfo = [
    "107/65 ม.1 ต.มะเร็ต อ.เกาะสมุย",
    "จ.สุราษฏร์ธานี 84310",
    "โทร 0947495654",
  ];

  companyInfo.forEach((info, index) => {
    addThaiText(info, margin + 22, 8 + index * 4);
  });

  yPosition = 35;

  // Document Header
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("NotoSerifThai", "normal");

  const formatThaiDate = (dateString: string): string => {
    const date = new Date(dateString);
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  yPosition += 10;

  // หัวข้อหลัก
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("NotoSerifThai", "bold");
  const mainTitle = "รายงานผลการประชุม";
  const titleWidth = doc.getTextWidth(mainTitle);
  const centerX = (pageWidth - titleWidth) / 2;
  addThaiText(mainTitle, centerX, yPosition);

  doc.setDrawColor(...underlineColor);
  doc.setLineWidth(0.8);
  doc.line(centerX, yPosition + 5, centerX + titleWidth, yPosition + 5);
  yPosition += 25;

  // ชื่อการประชุม
  const titleLines = splitThaiText(note.title, contentWidth - 10);

  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("NotoSerifThai", "bold");

  titleLines.forEach((line: string, index: number) => {
    const lineWidth = doc.getTextWidth(line);
    const lineCenterX = (pageWidth - lineWidth) / 2;
    addThaiText(line, lineCenterX, yPosition + index * 7);
  });
  yPosition += titleLines.length * 7 + 20;

  // === ข้อมูลพื้นฐาน ===
  checkAndAddPage(60);

  // ตั้งค่าฟอนต์สำหรับข้อมูลพื้นฐาน
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11); // ขนาดเนื้อหา 11
  doc.setFont("NotoSerifThai", "normal");

  // วันที่ (บรรทัดแรก)
  const dateText = `Meeting Date | วันที่จัดประชุม: ${formatThaiDate(note.createDate)}`;
  addThaiText(dateText, margin, yPosition);

  // รหัสลูกค้า (บรรทัดที่สอง)
  const customerText = `Customer ID | รหัสลูกค้า: ${note.customerId}`;
  addThaiText(customerText, margin, yPosition + 8);

  // เวลาสร้างรายงาน (บรรทัดที่สาม)
  const timeText = `Report Time | เวลาสร้างรายงาน: ${new Date().toLocaleTimeString("th-TH")}`;
  addThaiText(timeText, margin, yPosition + 16);

  yPosition += 30;

  // === โปรเจค ===
  checkAndAddPage(40);

  // หัวข้อส่วน - สวยงาม
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14); // ขนาดหัวข้อ 14
  doc.setFont("NotoSerifThai", "bold");
  addThaiText("Project | โปรเจค", margin, yPosition);

  // เส้นใต้หัวข้อ
  doc.setDrawColor(...underlineColor);
  doc.setLineWidth(0.8);
  doc.line(margin, yPosition + 5, margin + 50, yPosition + 5);
  yPosition += 25;

  // ชื่อโปรเจค
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12); // ขนาดเนื้อหา 12
  doc.setFont("NotoSerifThai", "normal");
  const projectLines = splitThaiText(
    note.project || "",
    contentWidth - 10
  );
  projectLines.forEach((line: string, index: number) => {
    addThaiText(line, margin, yPosition + index * 6);
  });
  yPosition += projectLines.length * 6 + 20;

  // ผู้เข้าร่วมประชุม
  if (note.attendees && note.attendees.length > 0) {
    checkAndAddPage(60);

    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont("NotoSerifThai", "bold");
    addThaiText("Attendees | ผู้เข้าร่วมประชุม", margin, yPosition);

    doc.setDrawColor(...underlineColor);
    doc.setLineWidth(0.8);
    doc.line(margin, yPosition + 5, margin + 50, yPosition + 5);
    yPosition += 25;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("NotoSerifThai", "normal");

    note.attendees.forEach((attendee, index) => {
      checkAndAddPage(10);
      const attendeeText = `${index + 1}. ${attendee.role}: ${attendee.name}`;
      addThaiText(attendeeText, margin, yPosition + index * 8);
    });
    yPosition += note.attendees.length * 8 + 20;
  }

  // รายละเอียดการประชุม
  if (note.noteExpand && note.noteExpand.length > 0) {
    note.noteExpand.forEach((detail) => {
      addPageHeader();

      // หัวข้อการประชุม
      doc.setTextColor(...primaryColor);
      doc.setFontSize(14);
      doc.setFont("NotoSerifThai", "bold");
      const topicTitle = `Topic | หัวข้อ: ${detail.name || ""}`;
      const topicTitleLines = splitThaiText(topicTitle, contentWidth - 10);

      topicTitleLines.forEach((line: string, lineIndex: number) => {
        addThaiText(line, margin, yPosition + lineIndex * 7);
      });

      doc.setDrawColor(...underlineColor);
      doc.setLineWidth(0.8);
      doc.line(
        margin,
        yPosition + (topicTitleLines.length - 1) * 7 + 5,
        pageWidth - margin,
        yPosition + (topicTitleLines.length - 1) * 7 + 5
      );
      yPosition += topicTitleLines.length * 7 + 25;

      // รายละเอียด
      if (detail.description) {
        // หัวข้อย่อย - รายละเอียด
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont("NotoSerifThai", "bold");
        const detailSubTitle = "Details | รายละเอียด";
        addThaiText(detailSubTitle, margin, yPosition);
        yPosition += 8;

        // เส้นใต้หัวข้อย่อย
        doc.setDrawColor(...underlineColor);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition + 2, margin + 40, yPosition + 2);
        yPosition += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("NotoSerifThai", "normal");
        const descriptionLines = splitThaiText(
          detail.description,
          contentWidth - 10
        );

        for (let i = 0; i < descriptionLines.length; i++) {
          const line = descriptionLines[i];
          if (checkAndAddPage(8)) {
            // ถ้าสร้างหน้าใหม่แล้ว ตั้งค่าฟอนต์สำหรับเนื้อหา
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont("NotoSerifThai", "normal");
          }
          addThaiText(line, margin, yPosition);
          yPosition += 5;
        }
        yPosition += 15;
      }

      // ข้อสรุป - อยู่หน้าเดียวกันกับหัวข้อ
      if (detail.conclude) {
        // หัวข้อย่อย - ข้อสรุป
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont("NotoSerifThai", "bold");
        const concludeSubTitle = "Conclusion | ข้อสรุป";
        addThaiText(concludeSubTitle, margin, yPosition);
        yPosition += 8;

        // เส้นใต้หัวข้อย่อย
        doc.setDrawColor(...underlineColor);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition + 2, margin + 40, yPosition + 2);
        yPosition += 8;

        // เนื้อหาข้อสรุป
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("NotoSerifThai", "normal");
        const concludeLines = splitThaiText(
          detail.conclude,
          contentWidth - 10
        );

        for (let i = 0; i < concludeLines.length; i++) {
          const line = concludeLines[i];
          if (checkAndAddPage(8)) {
            // ถ้าสร้างหน้าใหม่แล้ว ตั้งค่าฟอนต์สำหรับเนื้อหา
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont("NotoSerifThai", "normal");
          }
          addThaiText(line, margin, yPosition);
          yPosition += 5;
        }
        yPosition += 20;
      }
    });
  }

  // ไม่แสดงหน้าไฟล์แนบในรายงานการประชุม

  // === ส่วนท้าย ===
  yPosition += 20;

  // พื้นที่สำหรับลายเซ็น - แบบเรียบง่าย
  checkAndAddPage(40);

  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont("NotoSerifThai", "normal");
  addThaiText("ลายเซ็นผู้จัดทำรายงาน", margin, yPosition);
  yPosition += 15;

  // เส้นสำหรับลายเซ็น - ลดขนาด
  doc.setDrawColor(...secondaryColor);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition, margin + 60, yPosition);

  // วันที่ลงนาม - รูปแบบ __/__/__ ลดขนาด
  addThaiText("วันที่", margin + 80, yPosition - 3);

  // เส้นสำหรับวันที่ - ลดขนาด
  const dateLineY = yPosition;
  const dateStartX = margin + 100;

  // วัน
  doc.line(dateStartX, dateLineY, dateStartX + 10, dateLineY);
  addThaiText("/", dateStartX + 12, dateLineY - 2);

  // เดือน
  doc.line(dateStartX + 16, dateLineY, dateStartX + 26, dateLineY);
  addThaiText("/", dateStartX + 28, dateLineY - 2);

  // ปี
  doc.line(dateStartX + 32, dateLineY, dateStartX + 50, dateLineY);

  // Footer - เพิ่มหมายเลขหน้าและวันที่
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // เส้นล่างสุด
    doc.setDrawColor(...underlineColor);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

    doc.setTextColor(...secondaryColor);
    doc.setFontSize(9);
    doc.setFont("NotoSerifThai", "normal");

    // หมายเลขหน้า (ขวา)
    const pageText = `หน้า ${i} จาก ${totalPages}`;
    addThaiText(pageText, pageWidth - 35, pageHeight - 12);

    // วันที่สร้างรายงาน (ซ้าย)
    const reportDate = `สร้างรายงาน: ${formatThaiDate(
      new Date().toISOString()
    )}`;
    addThaiText(reportDate, margin, pageHeight - 12);

    // ชื่อระบบ (กลาง)
    addThaiText(
      "ระบบจัดการบันทึกการประชุม",
      pageWidth / 2 - 30,
      pageHeight - 12
    );
  }

  // Return PDF เป็น ArrayBuffer
  const pdfOutput = doc.output("arraybuffer");
  return pdfOutput;
};

// ฟังก์ชันโหลดฟอนต์ไทย (คัดลอกจาก pdfExport.ts)
const loadThaiFont = async (): Promise<string> => {
  try {
    const response = await fetch(
      "/fonts/NotoSerifThai-VariableFont_wdth,wght.ttf"
    );
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error("Error loading Thai font:", error);
    throw new Error("ไม่สามารถโหลดฟอนต์ไทยได้");
  }
};

// ฟังก์ชันโหลดโลโก้ (คัดลอกจาก pdfExport.ts)
const loadLogo = async (): Promise<string> => {
  try {
    const response = await fetch("/LogoPDF.png");
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return "data:image/png;base64," + btoa(binary);
  } catch (error) {
    console.error("Error loading logo:", error);
    return "";
  }
};

// ฟังก์ชันเพิ่มฟอนต์ไทย (คัดลอกจาก pdfExport.ts)
const addThaiFont = (doc: any, fontData: string) => {
  try {
    doc.addFileToVFS("NotoSerifThai.ttf", fontData);
    doc.addFont("NotoSerifThai.ttf", "NotoSerifThai", "normal");
    doc.addFont("NotoSerifThai.ttf", "NotoSerifThai", "bold");
    doc.setFont("NotoSerifThai");
  } catch (error) {
    console.error("Error adding Thai font to PDF:", error);
    doc.setFont("helvetica");
  }
};
