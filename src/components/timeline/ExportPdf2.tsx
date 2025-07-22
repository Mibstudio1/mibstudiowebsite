import React from "react";
import PdfHeader from "../exportPdf/PdfHeader";

interface ExportPdf2Props {
  customerComments: {
    proposal?: string;
    specialRequest?: string;
    additionalAgreement?: string;
  };
}

const boxStyle: React.CSSProperties = {
  background: "#fff",
  border: "1.5px solid #e5e7eb",
  borderRadius: 14,
  maxWidth: 650,
  margin: "32px auto",
  boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)",
  padding: "32px 40px",
};

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "#222",
  marginBottom: 24,
  borderBottom: "2px solid #e5e7eb",
  paddingBottom: 12,
  letterSpacing: 1,
  textAlign: "center",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 24,
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#222",
  fontSize: 15,
  marginBottom: 6,
  letterSpacing: 0.5,
};

const thStyle: React.CSSProperties = {
  color: "#666",
  fontWeight: 400,
  fontSize: 14,
  marginLeft: 8,
};

const valueStyle: React.CSSProperties = {
  color: "#333",
  fontSize: 15,
  background: "#f8f9fa",
  borderRadius: 8,
  padding: "12px 16px",
  minHeight: 32,
  border: "1px solid #e5e7eb",
  marginTop: 2,
  whiteSpace: "pre-line",
  wordWrap: "break-word",
  wordBreak: "break-word",
  overflowWrap: "break-word",
};

const ExportPdf2: React.FC<ExportPdf2Props> = ({ customerComments }) => {
  return (
    <div id="pdf-content" style={{ fontFamily: "Noto Serif Thai, Arial, sans-serif", margin: 0, padding: 0 }}>
      <style>{`
        body, #pdf-content { margin: 0 !important; padding: 0 !important; }
        @page { margin: 0; }
      `}</style>
      <PdfHeader />
      <div style={boxStyle}>
        <div style={titleStyle}>Proposal for Client <span style={thStyle}>| ข้อเสนอสำหรับลูกค้า</span></div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Proposal Details <span style={thStyle}>| รายละเอียดข้อเสนอ</span></div>
          <div style={valueStyle}>
            {customerComments.proposal && customerComments.proposal.trim() !== ""
              ? customerComments.proposal.substring(0, 1000).split(/\r?\n/).map((line, idx) =>
                  line.trim() !== "" ? (
                    <div key={idx} style={{marginBottom: 6}}>{line}</div>
                  ) : null
                )
              : <div style={{color: "#999", fontStyle: "italic"}}> ไม่มีข้อเสนอเพิ่มเติม</div>
            }
            {customerComments.proposal && customerComments.proposal.length > 1000 && (
              <div style={{color: "#999", fontStyle: "italic", marginTop: 8}}>
                (แสดงเพียง 1000 ตัวอักษรแรก จากทั้งหมด {customerComments.proposal.length} ตัวอักษร)
              </div>
            )}
          </div>
        </div>
        
        <div style={sectionStyle}>
          <div style={labelStyle}>Special Requests <span style={thStyle}>| ความต้องการพิเศษ</span></div>
          <div style={valueStyle}>
            {customerComments.specialRequest && customerComments.specialRequest.trim() !== ""
              ? customerComments.specialRequest.substring(0, 1000).split(/\r?\n/).map((line, idx) =>
                  line.trim() !== "" ? (
                    <div key={idx} style={{marginBottom: 6}}> {line}</div>
                  ) : null
                )
              : <div style={{color: "#999", fontStyle: "italic"}}> ไม่มีความต้องการพิเศษ</div>
            }
            {customerComments.specialRequest && customerComments.specialRequest.length > 1000 && (
              <div style={{color: "#999", fontStyle: "italic", marginTop: 8}}>
                (แสดงเพียง 1000 ตัวอักษรแรก จากทั้งหมด {customerComments.specialRequest.length} ตัวอักษร)
              </div>
            )}
          </div>
        </div>
        
        <div style={sectionStyle}>
          <div style={labelStyle}>Additional Agreements <span style={thStyle}>| ข้อตกลงเพิ่มเติม</span></div>
          <div style={valueStyle}>
            {customerComments.additionalAgreement && customerComments.additionalAgreement.trim() !== ""
              ? customerComments.additionalAgreement.substring(0, 1000).split(/\r?\n/).map((line, idx) =>
                  line.trim() !== "" ? (
                    <div key={idx} style={{marginBottom: 6}}> {line}</div>
                  ) : null
                )
              : <div style={{color: "#999", fontStyle: "italic"}}> ไม่มีข้อตกลงเพิ่มเติม</div>
            }
            {customerComments.additionalAgreement && customerComments.additionalAgreement.length > 1000 && (
              <div style={{color: "#999", fontStyle: "italic", marginTop: 8}}>
                (แสดงเพียง 1000 ตัวอักษรแรก จากทั้งหมด {customerComments.additionalAgreement.length} ตัวอักษร)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPdf2; 