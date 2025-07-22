import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function GET() {
  try {
    // Configure Chromium for Vercel
    const executablePath = await chromium.executablePath();

    // Launch Puppeteer with Chromium configuration for Vercel
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    
    const page = await browser.newPage();

    // Set content with test HTML
    await page.setContent(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
            }
            h1 {
              color: #333;
              text-align: center;
            }
            .test-content {
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>ทดสอบการสร้าง PDF</h1>
          <div class="test-content">
            <h2>ข้อมูลโครงการ</h2>
            <p>นี่คือตัวอย่างการสร้าง PDF ด้วย Puppeteer บน Vercel</p>
            <p>วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>รายการ</th>
                <th>รายละเอียด</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>การตั้งค่า Puppeteer</td>
                <td>ใช้ puppeteer-core และ @sparticuz/chromium</td>
                <td>✅ สำเร็จ</td>
              </tr>
              <tr>
                <td>การ Deploy บน Vercel</td>
                <td>รองรับ serverless environment</td>
                <td>✅ สำเร็จ</td>
              </tr>
              <tr>
                <td>การสร้าง PDF</td>
                <td>รองรับภาษาไทยและ styling</td>
                <td>✅ สำเร็จ</td>
              </tr>
            </tbody>
          </table>
          
          <div class="test-content">
            <h3>หมายเหตุ</h3>
            <p>PDF นี้ถูกสร้างขึ้นโดยใช้ Puppeteer บน Vercel platform</p>
            <p>สามารถใช้สำหรับการสร้างรายงานและเอกสารต่างๆ</p>
          </div>
        </body>
      </html>
    `,
      { waitUntil: "networkidle0" }
    );

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=test-pdf.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating test PDF:", error);
    return NextResponse.json(
      { error: `Failed to generate test PDF: ${error}` },
      { status: 500 }
    );
  }
} 