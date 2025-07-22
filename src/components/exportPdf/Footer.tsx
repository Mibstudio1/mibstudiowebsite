import React from "react";
import { CSSProperties } from "react";

const Footer = ({ contentStyle }: { contentStyle: CSSProperties }) => {
  return (
    <div
      style={{
        marginTop: 40,
        padding: "24px 32px",
        borderTop: "2px solid #e5e7eb",
        maxWidth: 600,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ width: 240, textAlign: "left" }}>
          <div style={contentStyle}>
            <b>Customer Signature | ลงชื่อผู้อนุมัติ</b>
          </div>
          <div
            style={{
              borderTop: "1px solid #333",
              marginTop: 32,
              height: 2,
              width: "90%",
            }}
          ></div>
          <div style={contentStyle}>Date | วันที่: ___/__/__</div>
        </div>
        <div style={{ width: 240, textAlign: "right" }}>
          <div
            style={{
              ...contentStyle,
              textAlign: "left",
              marginLeft: 32,
            }}
          >
            <b>MIB Studio | ผู้มีอำนาจลงนาม</b>
          </div>
          <div
            style={{
              borderTop: "1px solid #333",
              marginTop: 32,
              height: 2,
              width: "90%",
              marginLeft: 32,
            }}
          ></div>
          <div
            style={{
              ...contentStyle,
              textAlign: "left",
              marginLeft: 32,
            }}
          >
            Date | วันที่: ___/__/__
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
