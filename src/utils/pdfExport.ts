import jsPDF from "jspdf";
import { Note } from "@/type/noteType";

// ฟังก์ชันสำหรับแปลงวันที่เป็นภาษาไทย
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
  const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.

  return `${day} ${month} ${year}`;
};

// ฟังก์ชันสำหรับแปลงข้อความไทยให้แสดงได้ใน PDF
const processThaiText = (text: string): string => {
  // ใช้ Unicode normalization เพื่อให้ข้อความไทยแสดงได้ถูกต้อง
  return text.normalize("NFC");
};

// ฟังก์ชันสำหรับโหลดและเพิ่มฟอนต์ไทย
const loadThaiFont = async (): Promise<string> => {
  try {
    const response = await fetch(
      "/fonts/NotoSerifThai-VariableFont_wdth,wght.ttf"
    );
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // แปลง ArrayBuffer เป็น base64
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

// ฟังก์ชันสำหรับโหลดโลโก้
const loadLogo = async (): Promise<string> => {
  try {
    const response = await fetch("/LogoPDF.png");
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // แปลง ArrayBuffer เป็น base64
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return "data:image/png;base64," + btoa(binary);
  } catch (error) {
    console.error("Error loading logo:", error);
    return ""; // ถ้าโหลดโลโก้ไม่ได้ ให้ข้ามไป
  }
};

// ฟังก์ชันสำหรับเพิ่มฟอนต์ไทยใน jsPDF
const addThaiFont = (doc: jsPDF, fontData: string) => {
  try {
    // เพิ่มฟอนต์ไทยใน jsPDF
    doc.addFileToVFS("NotoSerifThai.ttf", fontData);
    doc.addFont("NotoSerifThai.ttf", "NotoSerifThai", "normal");
    doc.addFont("NotoSerifThai.ttf", "NotoSerifThai", "bold");

    // ตั้งค่าฟอนต์เริ่มต้น
    doc.setFont("NotoSerifThai");
  } catch (error) {
    console.error("Error adding Thai font to PDF:", error);
    // ถ้าเพิ่มฟอนต์ไม่ได้ ใช้ฟอนต์เริ่มต้น
    doc.setFont("helvetica");
  }
};

export const exportNoteToPDF = async (note: Note): Promise<void> => {
  try {
    // โหลดฟอนต์ไทยและโลโก้
    const [fontData, logoData] = await Promise.all([
      loadThaiFont(),
      loadLogo(),
    ]);

    // สร้าง PDF ด้วย Unicode support
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

    // สีสำหรับการตกแต่ง - ใช้สีดำทั้งหมด
    const primaryColor = [17, 17, 17] as [number, number, number]; // Black #111
    const secondaryColor = [108, 117, 125] as [number, number, number]; // Professional gray
    const lightGray = [245, 245, 245] as [number, number, number]; // Light gray for backgrounds
    const underlineColor = [128, 128, 128] as [number, number, number]; // Gray for underlines

    // ฟังก์ชันสำหรับเพิ่มข้อความที่รองรับภาษาไทย
    const addThaiText = (text: string, x: number, y: number, options?: any) => {
      const processedText = processThaiText(text);
      if (options) {
        doc.text(processedText, x, y, options);
      } else {
        doc.text(processedText, x, y);
      }
    };

    // ฟังก์ชันสำหรับแบ่งข้อความที่รองรับภาษาไทย
    const splitThaiText = (text: string, maxWidth: number) => {
      const processedText = processThaiText(text);
      return doc.splitTextToSize(processedText, maxWidth);
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

      // === COMPANY HEADER สำหรับหน้าใหม่ ===
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
      doc.setTextColor(255, 255, 255); // สีขาว
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

    // === COMPANY HEADER ===
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
    doc.setTextColor(255, 255, 255); // สีขาว
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

    // === DOCUMENT HEADER ===
    // ข้อมูลพื้นฐาน (ไม่มีกรอบและพื้นหลัง)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11); // ขนาดเนื้อหา 11
    doc.setFont("NotoSerifThai", "normal");

    yPosition += 10;

    // หัวข้อหลัก - ตรงกลางและสวยงาม
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14); // ขนาดหัวข้อเท่ากับหัวข้ออื่น
    doc.setFont("NotoSerifThai", "bold");
    const mainTitle = "รายงานผลการประชุม";
    const titleWidth = doc.getTextWidth(mainTitle);
    const centerX = (pageWidth - titleWidth) / 2;
    addThaiText(mainTitle, centerX, yPosition);

    // เส้นใต้หัวข้อ - ตรงกลาง
    doc.setDrawColor(...underlineColor);
    doc.setLineWidth(0.8);
    doc.line(centerX, yPosition + 5, centerX + titleWidth, yPosition + 5);
    yPosition += 25;

    // ชื่อการประชุม (ไม่มีกรอบและพื้นหลัง)
    const titleLines = splitThaiText(
      processThaiText(note.title),
      contentWidth - 10
    );

    doc.setTextColor(...primaryColor);
    doc.setFontSize(14); // ขนาดหัวข้อ 14
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
    const timeText = `Report Time | เวลาสร้างรายงาน: ${new Date().toLocaleTimeString(
      "th-TH"
    )}`;
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
      processThaiText(note.project || ""),
      contentWidth - 10
    );
    projectLines.forEach((line: string, index: number) => {
      addThaiText(line, margin, yPosition + index * 6);
    });
    yPosition += projectLines.length * 6 + 20;

    // === ผู้เข้าร่วมประชุม ===
    if (note.attendees && note.attendees.length > 0) {
      checkAndAddPage(60);

      // หัวข้อส่วน - สวยงาม
      doc.setTextColor(...primaryColor);
      doc.setFontSize(14); // ขนาดหัวข้อ 14
      doc.setFont("NotoSerifThai", "bold");
      addThaiText("Attendees | ผู้เข้าร่วมประชุม", margin, yPosition);

      // เส้นใต้หัวข้อ
      doc.setDrawColor(...underlineColor);
      doc.setLineWidth(0.8);
      doc.line(margin, yPosition + 5, margin + 50, yPosition + 5);
      yPosition += 25;

      // รายชื่อ (ไม่มีกรอบและพื้นหลัง)
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12); // ขนาดเนื้อหา 12
      doc.setFont("NotoSerifThai", "normal");

      note.attendees.forEach((attendee, index) => {
        checkAndAddPage(10);
        const attendeeText = `${index + 1}. ${processThaiText(
          attendee.role
        )}: ${processThaiText(attendee.name)}`;
        addThaiText(attendeeText, margin, yPosition + index * 8);
      });
      yPosition += note.attendees.length * 8 + 20;
    }

    // === รายละเอียดการประชุม - หัวข้อและสรุปอยู่หน้าเดียวกัน ===
    if (note.noteExpand && note.noteExpand.length > 0) {
      note.noteExpand.forEach((detail, index) => {
        // เริ่มหน้าใหม่ทุกหัวข้อ
        addPageHeader();

        // หัวข้อการประชุม - รองรับหลายบรรทัด
        doc.setTextColor(...primaryColor);
        doc.setFontSize(14); // ขนาดหัวข้อ 14
        doc.setFont("NotoSerifThai", "bold");
        const topicTitle = `Topic | หัวข้อ: ${processThaiText(
          detail.name || ""
        )}`;
        const topicTitleLines = splitThaiText(topicTitle, contentWidth - 10);

        topicTitleLines.forEach((line: string, lineIndex: number) => {
          addThaiText(line, margin, yPosition + lineIndex * 7);
        });

        // เส้นใต้หัวข้อ - ยาวเต็มความกว้างเนื้อหา
        doc.setDrawColor(...underlineColor);
        doc.setLineWidth(0.8);
        doc.line(
          margin,
          yPosition + (topicTitleLines.length - 1) * 7 + 5,
          pageWidth - margin,
          yPosition + (topicTitleLines.length - 1) * 7 + 5
        );
        yPosition += topicTitleLines.length * 7 + 25;

        // รายละเอียด - ไหลต่อเนื่อง
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
          doc.setFontSize(12); // ขนาดเนื้อหา 12
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
          doc.setFontSize(12); // ขนาดเนื้อหา 12
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

    // บันทึกไฟล์
    const cleanTitle = note.title
      .replace(/[^a-zA-Z0-9ก-๙\s]/g, "")
      .replace(/\s+/g, "_");
    const fileName = `รายงานการประชุม_${cleanTitle}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("ไม่สามารถสร้างไฟล์ PDF ได้");
  }
};
