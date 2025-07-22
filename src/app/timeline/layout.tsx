import Navbar from "@/components/navbar/Navbar";

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white">
      {children}
    </main>
  );
} 