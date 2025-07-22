import React from "react";
import PdfHeader from "../exportPdf/PdfHeader";

interface SectionTitlePageProps {
  title: string; // รูปแบบ: 'English | ไทย'
}

const SectionTitlePage: React.FC<SectionTitlePageProps> = ({ title }) => {
  // แยกภาษาอังกฤษและไทย
  const [en, th] = title.split("|").map(s => s.trim());
  return (
    <div id="pdf-content" style={{ fontFamily: "Noto Serif Thai, Arial, sans-serif", margin: 0, padding: 0 }}>
      <style>{`
        body, #pdf-content { margin: 0 !important; padding: 0 !important; }
        @page { margin: 0; }
      `}</style>
      <PdfHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Noto Serif Thai, THSarabunNew, Arial, sans-serif",
          background: "#fff",
          margin: "48px auto 24px auto",
          padding: 0,
          maxWidth: 600,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#222",
              letterSpacing: 1,
              marginBottom: 6,
              wordBreak: "break-word",
            }}
          >
            {en}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#222",
              letterSpacing: 0.5,
              wordBreak: "break-word",
            }}
          >
            {th}
          </div>
        </div>
        <div
          style={{
            width: 180,
            height: 3,
            background: "#bbb",
            borderRadius: 2,
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
};

export default SectionTitlePage; 