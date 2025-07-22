"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

console.log = () => null;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg text-gray-600">กำลังเปลี่ยนเส้นทาง...</div>
      </div>
    </div>
  );
}
