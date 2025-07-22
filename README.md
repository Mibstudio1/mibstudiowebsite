# ClientNote - ระบบจัดการลูกค้าและบันทึกการประชุม

ระบบจัดการลูกค้าและบันทึกการประชุมสำหรับ MIB Studio ที่ออกแบบมาเพื่อช่วยให้ Admin จัดการข้อมูลลูกค้าและบันทึกการประชุมได้อย่างมีประสิทธิภาพ

## ฟีเจอร์หลัก

### 1. ระบบบัญชีผู้ใช้
- ระบบลงทะเบียน & ล็อกอินเฉพาะ Admin
- Admin เป็นผู้กรอกข้อมูลทั้งหมด ไม่เปิดให้ลูกค้าเข้าระบบเอง
- ระบบ Authentication ด้วย JWT

### 2. ระบบจัดการลูกค้า
- เพิ่มลูกค้าใหม่พร้อมรหัสอัตโนมัติ (เช่น CUS-20250712-001)
- ระบุข้อมูล: ชื่อบริษัท / ชื่อลูกค้า / เบอร์ติดต่อ / ที่อยู่
- ค้นหาลูกค้าด้วยรหัสประจำตัวลูกค้าหรือชื่อ
- แก้ไขและลบข้อมูลลูกค้า

### 3. ระบบบันทึกการประชุม
- เพิ่มการบันทึกใหม่ได้หลายครั้งต่อวัน
- แต่ละการบันทึกแยกกันแม้เป็นลูกค้าเดิม
- ข้อมูลที่บันทึก:
  - วันที่ประชุม
  - หัวข้อที่พูดคุย
  - รายละเอียดการประชุม
  - ผู้เข้าร่วม (พนักงาน + ลูกค้า)
  - ข้อสรุป
  - แนบไฟล์ PDF (optional)

### 4. ระบบจัดการบันทึก
- เรียงตามวันที่ล่าสุด
- แสดงเฉพาะบันทึกของลูกค้าคนนั้น
- Filter:
  - ค้นหาด้วยชื่อ/รหัสประจำตัวลูกค้า
  - ค้นหาด้วยช่วงเวลา
  - ค้นหาด้วย keyword
- Export PDF (coming soon)
- แชร์ข้อมูลผ่าน LINE/WhatsApp (coming soon)

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with cookies
- **Styling**: Tailwind CSS

## การติดตั้ง

1. Clone repository
```bash
git clone <repository-url>
cd clientnote
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. ตั้งค่า environment variables
```bash
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/clientnote"
DIRECT_URL="postgresql://username:password@localhost:5432/clientnote"
JWT_SECRET="your-secret-key"
```

4. รัน database migration
```bash
npx prisma migrate dev
npx prisma generate
```

5. รัน development server
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## โครงสร้างโปรเจค

```
clientnote/
├── src/
│   ├── app/
│   │   ├── api/                    # API endpoints
│   │   │   ├── authen/            # Authentication APIs
│   │   │   ├── customer/          # Customer management APIs
│   │   │   └── note/              # Note management APIs
│   │   ├── dashboard/             # Dashboard pages
│   │   │   ├── customers/         # Customer management pages
│   │   │   └── notes/             # Note management pages
│   │   ├── login/                 # Login page
│   │   └── page.tsx               # Home page (redirects to login)
│   ├── schema/                    # Validation schemas
│   ├── services/                  # Business logic
│   ├── type/                      # TypeScript types
│   └── utils/                     # Utility functions
├── prisma/
│   └── schema.prisma              # Database schema
└── public/                        # Static files
```

## API Endpoints

### Authentication
- `POST /api/authen/login` - เข้าสู่ระบบ
- `POST /api/authen/register` - ลงทะเบียน
- `POST /api/authen/logout` - ออกจากระบบ
- `GET /api/authen/me` - ตรวจสอบ authentication

### Customer Management
- `GET /api/customer` - ดึงข้อมูลลูกค้าทั้งหมด
- `POST /api/customer` - เพิ่มลูกค้าใหม่
- `PUT /api/customer/edit` - แก้ไขข้อมูลลูกค้า

### Note Management
- `GET /api/note` - ดึงข้อมูลบันทึกการประชุมทั้งหมด
- `POST /api/note/create` - สร้างบันทึกการประชุมใหม่
- `PUT /api/note/update` - แก้ไขบันทึกการประชุม
- `DELETE /api/note` - ลบบันทึกการประชุม

## การใช้งาน

1. เข้าสู่ระบบด้วย Admin account
2. ไปที่หน้า Dashboard เพื่อดูภาพรวมระบบ
3. จัดการลูกค้า:
   - เพิ่มลูกค้าใหม่
   - ค้นหาและแก้ไขข้อมูลลูกค้า
4. จัดการบันทึกการประชุม:
   - เพิ่มบันทึกการประชุมใหม่
   - ดูรายละเอียดการประชุม
   - แก้ไขและลบบันทึก

## การพัฒนา

### การเพิ่มฟีเจอร์ใหม่
1. สร้าง API endpoint ใน `src/app/api/`
2. สร้างหน้า UI ใน `src/app/dashboard/`
3. อัปเดต Prisma schema หากจำเป็น
4. รัน migration: `npx prisma migrate dev`

### การแก้ไข UI
- ใช้ Tailwind CSS สำหรับ styling
- ใช้ TypeScript สำหรับ type safety
- ใช้ React hooks สำหรับ state management

## การ Deploy

1. Build project
```bash
npm run build
```

2. Deploy ไปยัง platform ที่ต้องการ (Vercel, Netlify, etc.)

## License

MIT License
# megawebza
