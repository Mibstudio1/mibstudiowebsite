# ระบบแชร์รายงานการประชุม

## ฟีเจอร์หลัก
- รวม PDF รายงานการประชุมกับไฟล์ PDF ที่แนบมา
- สร้าง URL สำหรับแชร์
- รองรับการแชร์ไปยังแพลตฟอร์มต่างๆ ผ่าน next-share

## แพลตฟอร์มที่รองรับ
- Facebook
- Twitter/X
- Line
- WhatsApp
- Email
- คัดลอก URL

## ข้อจำกัดของ next-share

### 1. ข้อจำกัดของแต่ละแพลตฟอร์ม

#### Facebook
- **ข้อจำกัด**: Facebook มีการตรวจสอบ URL และอาจไม่แสดง preview ของไฟล์ PDF
- **แก้ไข**: ใช้ Open Graph meta tags หรือสร้างหน้า landing page

#### Twitter/X
- **ข้อจำกัด**: ความยาวข้อความจำกัดที่ 280 ตัวอักษร
- **แก้ไข**: ใช้ข้อความสั้นๆ และ URL shortener

#### Line
- **ข้อจำกัด**: ต้องมี Line app ติดตั้งในอุปกรณ์
- **แก้ไข**: ตรวจสอบ user agent และแสดงทางเลือกอื่น

#### WhatsApp
- **ข้อจำกัด**: ต้องมี WhatsApp ติดตั้งในอุปกรณ์
- **แก้ไข**: ใช้ WhatsApp Web API สำหรับ desktop

#### Email
- **ข้อจำกัด**: ขึ้นอยู่กับ email client ของผู้ใช้
- **แก้ไข**: ใช้ mailto: protocol

### 2. ข้อจำกัดทั่วไป

#### File Size
- **ปัญหา**: PDF ที่รวมแล้วอาจมีขนาดใหญ่
- **แก้ไข**: 
  - บีบอัด PDF ก่อนรวม
  - แจ้งเตือนผู้ใช้เมื่อไฟล์ใหญ่เกิน 10MB
  - ใช้ cloud storage สำหรับไฟล์ขนาดใหญ่

#### Browser Compatibility
- **ปัญหา**: บาง browser อาจไม่รองรับ PDF.js หรือ Blob URLs
- **แก้ไข**: 
  - ตรวจสอบ browser support
  - ใช้ polyfills สำหรับ browser เก่า

#### Mobile Limitations
- **ปัญหา**: การแชร์บน mobile อาจมีข้อจำกัด
- **แก้ไข**: 
  - ใช้ Web Share API สำหรับ mobile
  - Fallback เป็น copy URL

### 3. Security และ Privacy

#### URL Expiration
- **ปัญหา**: Blob URLs จะหมดอายุเมื่อปิด browser
- **แก้ไข**: 
  - Upload ไฟล์ไปยัง cloud storage
  - สร้าง temporary URLs ที่มีอายุ 24 ชั่วโมง

#### File Access Control
- **ปัญหา**: ไฟล์ที่แชร์อาจถูกเข้าถึงโดยคนที่ไม่ได้รับอนุญาต
- **แก้ไข**: 
  - ใช้ signed URLs
  - เพิ่มระบบ authentication

## วิธีใช้งาน

### 1. การติดตั้ง
```bash
npm install next-share pdf-lib
```

### 2. การใช้งานใน Component
```tsx
import ShareButton from '@/components/ShareButton';

// ใน component
<ShareButton note={note} />
```

### 3. การปรับแต่ง

#### เปลี่ยนข้อความแชร์
```tsx
const shareTitle = `รายงานการประชุม: ${note.title}`;
const shareDescription = `รายงานการประชุมวันที่ ${new Date(note.createDate).toLocaleDateString('th-TH')}`;
```

#### เพิ่มแพลตฟอร์มใหม่
```tsx
import { TelegramShareButton, TelegramIcon } from 'next-share';

<TelegramShareButton url={shareUrl} title={shareTitle}>
  <TelegramIcon size={40} round />
</TelegramShareButton>
```

## การแก้ไขปัญหาที่พบบ่อย

### 1. PDF ไม่สามารถรวมได้
```typescript
// ตรวจสอบ CORS headers
const response = await fetch(attachment.url, {
  mode: 'cors',
  credentials: 'same-origin'
});
```

### 2. ฟอนต์ไทยไม่แสดงใน PDF ที่รวม
```typescript
// ตรวจสอบว่าฟอนต์ถูกโหลดแล้ว
if (!fontData) {
  throw new Error('Thai font not loaded');
}
```

### 3. การแชร์ไม่ทำงานบน mobile
```typescript
// ใช้ Web Share API
if (navigator.share) {
  await navigator.share({
    title: shareTitle,
    text: shareDescription,
    url: shareUrl
  });
} else {
  // Fallback เป็น copy URL
  await navigator.clipboard.writeText(shareUrl);
}
```

## การพัฒนาต่อ

### 1. Cloud Storage Integration
- เพิ่มการ upload ไฟล์ไปยัง AWS S3, Google Cloud Storage
- สร้าง signed URLs สำหรับความปลอดภัย

### 2. Analytics
- ติดตาม click rate ของการแชร์
- วิเคราะห์แพลตฟอร์มที่ได้รับความนิยม

### 3. Optimization
- บีบอัด PDF ก่อนรวม
- ใช้ Web Workers สำหรับการประมวลผล PDF

### 4. Enhanced Security
- เพิ่มระบบ authentication สำหรับไฟล์ที่แชร์
- ตั้งค่า expiration time สำหรับ URLs

## ตัวอย่างการใช้งาน

```typescript
// การสร้าง PDF ที่รวมแล้ว
const shareUrl = await mergePDFsAndCreateShareableURL(note);

// การแชร์ไปยัง Line
<LineShareButton url={shareUrl} title={shareTitle}>
  <LineIcon size={40} round />
</LineShareButton>

// การคัดลอก URL
navigator.clipboard.writeText(shareUrl);
```