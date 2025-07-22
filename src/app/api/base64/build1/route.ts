import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'utils', 'build1.b64.txt');
    const base64Content = fs.readFileSync(filePath, 'utf-8');
    
    return new NextResponse(base64Content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error reading build1 base64:', error);
    return new NextResponse('Error loading image', { status: 500 });
  }
} 