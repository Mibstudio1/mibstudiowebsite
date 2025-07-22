import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";
import path from "path";

export interface PDFOptions {
  format?: "A4" | "Letter" | "Legal";
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
  filename?: string;
}

export class PDFGenerator {
  private static async getBrowser() {
    // Check if we're in production (Vercel) or local development
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // Use @sparticuz/chromium for production (Vercel)
      try {
        // Set up Chromium for Vercel
        await chromium.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf');
        
        const executablePath = await chromium.executablePath();
        console.log('Chromium executable path:', executablePath);
        
        return await puppeteer.launch({
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
      
      return await puppeteerRegular.launch({
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
  }

  private static async processLogo(): Promise<string> {
    const logoPath = path.join(process.cwd(), 'public', 'LogoPDF.png');
    let logoBase64 = '';
    
    try {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (error) {
      console.error('Error reading logo file:', error);
    }
    
    return logoBase64;
  }

  private static async processFont(): Promise<string> {
    // Try multiple font paths
    const fontPaths = [
      path.join(process.cwd(), 'public', 'fonts', 'NotoSerifThai-VariableFont_wdth,wght.ttf'),
      path.join(process.cwd(), 'public', 'font', 'NotoSerifThai-VariableFont_wdth,wght.ttf'),
      path.join(process.cwd(), 'src', 'app', 'font', 'NotoSerifThai-VariableFont_wdth,wght.ttf'),
    ];

    for (const fontPath of fontPaths) {
      try {
        console.log('Trying font path:', fontPath);
        const fontBuffer = fs.readFileSync(fontPath);
        const fontBase64 = fontBuffer.toString('base64');
        console.log('Font loaded successfully from:', fontPath);
        return `data:font/ttf;base64,${fontBase64}`;
      } catch (error) {
        console.log('Font not found at:', fontPath);
      }
    }

    // Fallback to Google Fonts if local font not found
    console.log('Using Google Fonts fallback for Thai font');
    return 'https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;700&display=swap';
  }

  private static async getDefaultStyles(): Promise<string> {
    const fontData = await this.processFont();
    
    return `
      @font-face {
        font-family: 'Noto Serif Thai';
        src: url('${fontData}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      
      @font-face {
        font-family: 'Noto Serif Thai';
        src: url('${fontData}') format('truetype');
        font-weight: bold;
        font-style: normal;
      }
      
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
    `;
  }

  static async generatePDF(
    htmlContent: string, 
    options: PDFOptions = {}
  ): Promise<Uint8Array> {
    console.log('Starting PDF generation...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('VERCEL:', process.env.VERCEL);
    
    const browser = await this.getBrowser();
    
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

      // Process logo and font
      const [logoBase64, styles] = await Promise.all([
        this.processLogo(),
        this.getDefaultStyles()
      ]);

      let processedHtmlContent = htmlContent;
      
      if (logoBase64) {
        processedHtmlContent = htmlContent.replace(
          /src="\/LogoPDF\.png"/g,
          `src="${logoBase64}"`
        );
      }

      // Set content with styles
      await page.setContent(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              ${styles}
            </style>
          </head>
          <body>
            ${processedHtmlContent}
          </body>
        </html>
      `,
        { waitUntil: "networkidle0" }
      );

      // Wait for fonts to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate PDF with options
      const pdfOptions = {
        format: options.format || "A4",
        printBackground: options.printBackground !== false,
        margin: {
          top: options.margin?.top || "20mm",
          right: options.margin?.right || "20mm",
          bottom: options.margin?.bottom || "20mm",
          left: options.margin?.left || "20mm",
        },
      };

      console.log('Generating PDF with options:', pdfOptions);
      const pdf = await page.pdf(pdfOptions);
      
      console.log('PDF generated successfully, size:', pdf.length);
      return pdf;
    } catch (error) {
      console.error('Error in PDF generation:', error);
      throw error;
    } finally {
      await browser.close();
      console.log('Browser closed');
    }
  }

  static async generatePDFResponse(
    htmlContent: string,
    options: PDFOptions = {}
  ) {
    try {
      const pdf = await this.generatePDF(htmlContent, options);
      
      return new Response(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${options.filename || "document.pdf"}`,
        },
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error(`Failed to generate PDF: ${error}`);
    }
  }
} 