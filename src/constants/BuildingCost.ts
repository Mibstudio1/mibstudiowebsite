export const ROOM_TYPES = {
  indoor: {
    name: "ภายใน",
    pricePerSqm: 12000,
    color: "#A7C7E7", // ฟ้าอ่อน (pastel blue)
  },
  outdoor: {
    name: "ภายนอก",
    pricePerSqm: 8000,
    color: "#FFF9B0", // เหลืองอ่อน (pastel yellow)
  },
  pool: {
    name: "สระน้ำ",
    pricePerSqm: 25000,
    color: "#FFD1DC", // ชมพูอ่อน (pastel pink)
  },
  bathroom: {
    name: "ห้องน้ำ",
    pricePerSqm: 20000,
    color: "#B0EACD", // เขียวอ่อน (pastel green)
  },
};

export const ROOM_DISPLAY_CONFIG = {
  maxWidth: 600,
  maxHeight: 400,
  minWidth: 6,
  minHeight: 4,
  scaleFactor: 10, // Much larger scaling - 1 meter = 10 pixels for clear visibility
};
