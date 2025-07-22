import { ProjectInformationProps } from "@/interfaces/exportPdf";
import React from "react";

const ProjectInformation: React.FC<ProjectInformationProps> = ({
  contentStyle,
  pdfForm,
}) => {
  return (
    <div
      style={{
        marginBottom: 32,
        marginTop: 32,
        padding: "24px 32px",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        maxWidth: 600,
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: "bold",
          color: "#222",
          marginBottom: 16,
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: 8,
          letterSpacing: 1,
        }}
      >
        Project Information | ข้อมูลโครงการ
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...contentStyle,
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              <b>Project Name | ชื่อโครงการ:</b>
            </span>
            <span style={{ 
              wordBreak: "break-word", 
              lineHeight: 1.4,
              paddingLeft: 16
            }}>
              {pdfForm?.name || "-"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...contentStyle,
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              <b>Project Owner | เจ้าของโครงการ:</b>
            </span>
            <span style={{ 
              wordBreak: "break-word", 
              lineHeight: 1.4,
              paddingLeft: 16
            }}>
              {pdfForm?.projectOwner || "-"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...contentStyle,
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              <b>Document Date | วันที่ออกเอกสาร:</b>
            </span>
            <span style={{ 
              wordBreak: "break-word", 
              lineHeight: 1.4,
              paddingLeft: 16
            }}>
              {pdfForm?.documentDate || "___/__/__"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...contentStyle,
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              <b>Customer | ลูกค้า:</b>
            </span>
            <span style={{ 
              wordBreak: "break-word", 
              lineHeight: 1.4,
              paddingLeft: 16
            }}>
              {pdfForm?.client || "-"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...contentStyle,
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              <b>Location | สถานที่:</b>
            </span>
            <span style={{ 
              wordBreak: "break-word", 
              lineHeight: 1.4,
              paddingLeft: 16
            }}>
              {pdfForm?.location || "-"}
            </span>
          </div>
        </div>
      </div>
      {pdfForm?.description && (
        <div style={{ ...contentStyle, marginTop: 12 }}>
          <span style={{ whiteSpace: "nowrap" }}>
            <b>Description | รายละเอียด:</b>
          </span>
          <span style={{ 
            wordBreak: "break-word", 
            lineHeight: 1.4,
            paddingLeft: 16,
            display: "block",
            marginTop: 4
          }}>
            {pdfForm.description}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectInformation;
