import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { htmlContent } = data;

    console.log("Using Google Fonts for Thai text support...");

    if (!htmlContent) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    // Check if we're in production (Vercel) or local development
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
    
    let browser;
    
    if (isProduction) {
      // Use @sparticuz/chromium for production (Vercel)
      try {
        await chromium.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf');
        
        const executablePath = await chromium.executablePath();
        console.log('Chromium executable path:', executablePath);
        
        browser = await puppeteer.launch({
          args: [
            ...chromium.args,
            '--hide-scrollbars',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
          ],
          defaultViewport: chromium.defaultViewport,
          executablePath,
          headless: chromium.headless,
        });
      } catch (error) {
        console.error('Error launching Chromium:', error);
        throw new Error(`Failed to launch Chromium: ${error}`);
      }
    } else {
      // Use regular puppeteer for local development
      const puppeteerRegular = require('puppeteer');
      
      browser = await puppeteerRegular.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
        ],
      });
    }

    try {
      const page = await browser.newPage();
      
      // Set timeouts
      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);
      
      // Set viewport
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });

      // Set content with Google Fonts
      await page.setContent(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;700&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Noto Serif Thai', 'Noto Serif', Arial, sans-serif;
                margin: 0;
                padding: 20px;
                line-height: 1.6;
                color: #333;
                font-size: 14px;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1rem;
                font-family: 'Noto Serif Thai', 'Noto Serif', Arial, sans-serif;
              }
              
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
                font-family: 'Noto Serif Thai', 'Noto Serif', Arial, sans-serif;
              }
              
              th {
                background-color: #f8f9fa;
                font-weight: bold;
                font-family: 'Noto Serif Thai', 'Noto Serif', Arial, sans-serif;
              }
              
              img {
                max-width: 100%;
                height: auto;
                display: block;
              }
              
              h1, h2, h3, h4, h5, h6 {
                margin-top: 1rem;
                margin-bottom: 0.5rem;
                color: #2c3e50;
                font-family: 'Noto Serif Thai', 'Noto Serif', Arial, sans-serif;
              }
              
              h1 {
                font-size: 24px;
                text-align: center;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
                font-weight: bold;
              }
              
              h2 {
                font-size: 20px;
                color: #34495e;
                font-weight: bold;
              }
              
              p {
                margin-bottom: 0.5rem;
                font-family: 'Noto Serif Thai', 'Noto Serif', Arial, sans-serif;
              }
              
              .section {
                margin-bottom: 20px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
                font-family: 'Noto Serif Thai', 'Noto Serif', Arial, sans-serif;
              }
              
              .highlight {
                background-color: #e8f4fd;
                padding: 10px;
                border-left: 4px solid #3498db;
                margin: 10px 0;
                font-family: 'Noto Serif Thai', 'Noto Serif', Arial, sans-serif;
              }
              
              * {
                font-family: 'Noto Serif Thai', 'Noto Serif', Arial, sans-serif;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `,
        { waitUntil: "networkidle0" }
      );

      // Wait for fonts to load
      await new Promise(resolve => setTimeout(resolve, 3000));

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

      console.log("PDF generated with Google Fonts, size:", pdf.length);

      // Return PDF as response
      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=project-proposal-google-fonts.pdf",
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("Error generating PDF with Google Fonts:", error);
    
    return NextResponse.json(
      { 
        error: `Failed to generate PDF with Google Fonts: ${error}`,
        details: {
          environment: process.env.NODE_ENV,
          vercel: process.env.VERCEL,
          timestamp: new Date().toISOString(),
          originalError: String(error)
        }
      },
      { status: 500 }
    );
  }
} 