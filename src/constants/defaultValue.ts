export const defaultTasks = [
  // Architectural & Engineering Design
  "ออกแบบ พัฒนาแบบ",
  "เขียนแบบก่อสร้าง",
  "วิศวกร",
  "BOQ",
  "WEBSITE / BOOKSALE",
  "ตรวจสอบที่ดินก่อนซื้อขาย, ก่อนออกแบบ",
  // Construction Supervision Services
  "ควบคุมงานประจำ",
  "ตรวจเช็คที่ดิน ที่จะซื้อ",
  "รางวัด",
  "สอบเขต",
  "คอนทัวร์",
  // Construction Contracting Services
  "รีโนเวท",
  "ก่อสร้าง",
  "ทำป้าย",
];

export const serviceData = [
  {
    name: "Architechtural & Engineering Design",
    subtitle: "งานออกแบบ สถาปัตย์วิศวกร",
    field: "architechture",
    options: [
      {
        task: "ออกแบบ พัฒนาแบบ",
        price: "0",
        unit: "%",
      },
      {
        task: "เขียนแบบก่อสร้าง",
        price: "0",
        unit: "%",
      },
      {
        task: "วิศวกร",
        price: "0",
        unit: "%",
      },
      {
        task: "BOQ",
        price: "0",
        unit: "%",
      },
      {
        task: "WEBSITE / BOOKSALE",
        price: "0",
        unit: "%",
      },
      {
        task: "ตรวจสอบที่ดินก่อนซื้อขาย, ก่อนออกแบบ",
        price: "0",
        unit: "%",
      },
    ],
  },
  {
    name: "Construction Supervision Services",
    subtitle: "บริการควบคุมงานก่อนสร้าง",
    field: "supervistion",
    options: [
      {
        task: "ควบคุมงานประจำ",
        price: "0",
        unit: "%",
      },
      {
        task: "ตรวจเช็คที่ดิน ที่จะซื้อ",
        price: "0",
        unit: "%",
      },
      {
        task: "รางวัด",
        price: "0",
        unit: "%",
      },
      {
        task: "สอบเขต",
        price: "0",
        unit: "%",
      },
      {
        task: "คอนทัวร์",
        price: "0",
        unit: "%",
      },
    ],
  },
  {
    name: "Construction Contracting Services",
    subtitle: "บริการ รับเหมา ก่อสร้าง หรือ ว่าจ้างก่อสร้าง",
    field: "contracting",
    options: [
      {
        task: "รีโนเวท",
        price: "0",
        unit: "%",
      },
      {
        task: "ก่อสร้าง",
        price: "0",
        unit: "%",
      },
      {
        task: "ทำป้าย",
        price: "0",
        unit: "%",
      },
    ],
  },
];

export const categories = [
  {
    id: "architechture",
    name: "Architectural & Engineering Design",
    subtitle: "งานออกแบบ สถาปัตย์วิศวกร",
    color: "from-gray-800 to-gray-900",
    bgColor: "from-gray-50 to-gray-100",
    borderColor: "border-gray-300",
    tasks: [
      "ออกแบบ พัฒนาแบบ",
      "เขียนแบบก่อสร้าง",
      "วิศวกร",
      "BOQ",
      "WEBSITE / BOOKSALE",
      "ตรวจสอบที่ดินก่อนซื้อขาย, ก่อนออกแบบ",
    ],
  },
  {
    id: "supervistion",
    name: "Construction Supervision Services",
    subtitle: "บริการควบคุมงานก่อนสร้าง",
    color: "from-gray-700 to-gray-800",
    bgColor: "from-gray-50 to-gray-100",
    borderColor: "border-gray-300",
    tasks: [
      "ควบคุมงานประจำ",
      "ตรวจเช็คที่ดิน ที่จะซื้อ",
      "รางวัด",
      "สอบเขต",
      "คอนทัวร์",
    ],
  },
  {
    id: "contracting",
    name: "Construction Contracting Services",
    subtitle: "บริการ รับเหมา ก่อสร้าง หรือ ว่าจ้างก่อสร้าง",
    color: "from-gray-600 to-gray-700",
    bgColor: "from-gray-50 to-gray-100",
    borderColor: "border-gray-300",
    tasks: ["รีโนเวท", "ก่อสร้าง", "ทำป้าย"],
  },
];
