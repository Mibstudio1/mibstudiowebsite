import React from "react";

const PdfHeader = () => (
  <div
    style={{
      width: "100%",
      position: "relative",
      background: "#111",
      borderBottom: "2px solid #e5e7eb",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: "8px 20px",
      marginBottom: 8,
      minHeight: 50,
      boxSizing: "border-box",
      zIndex: 10,
      top: 0,
    }}
  >
    <img
      src="/LogoPDF.png"
      alt="MIB Studio Logo"
      style={{ width: 70, height: 70, marginRight: 16, objectFit: "contain" }}
    />
    <div style={{ color: "#fff", fontSize: 11, lineHeight: 1.5 }}>
      <div style={{ marginBottom: 2 }}>107/65 ม.1 ต.มะเร็ต อ.เกาะสมุย</div>
      <div style={{ marginBottom: 2 }}>จ.สุราษฏร์ธานี 84310</div>
      <div>โทร 0947495654</div>
    </div>
  </div>
);

export default PdfHeader;
