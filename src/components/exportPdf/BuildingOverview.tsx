import { BuildingOverviewProps } from "@/interfaces/exportPdf";
import React, { FC } from "react";

const BuildingOverview: FC<BuildingOverviewProps> = ({
  floorPlanImage,
  rooms,
  tableCellStyle,
  contentStyle,
  totalArea,
  totalConstructionCost,
  hasMultipleBuildings,
  additionalBuildingCount,
  additionalBuildingCost,
  mibPercent,
  designFee,
  grandTotal,
}) => {
  return (
    <div
      style={{
        pageBreakBefore: "always",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      <div
        style={{
          margin: "16px auto 0px auto",
          padding: "0",
          maxWidth: 600,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 12,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 6,
            letterSpacing: 1,
          }}
        >
          Building Overview | ภาพรวมอาคาร
        </div>
        {floorPlanImage ? (
          <div
            style={{
              width: "100%",
              maxWidth: 600,
              margin: "0 auto",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
              background: "#fff",
            }}
          >
            <img
              src={floorPlanImage}
              alt="Building Floor Plan"
              style={{
                width: "100%",
                maxWidth: 500,
                height: "auto",
                maxHeight: 300,
                objectFit: "contain",
                background: "#fff",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 350,
              maxWidth: 350,
              height: 200,
              minHeight: 200,
              margin: "0 auto",
              background: "#fff",
              border: "2px dashed #d1d5db",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Loading Floor Plan...
          </div>
        )}
      </div>
      <div
        style={{
          margin: "-8px auto 8px auto",
          padding: "16px 32px",
          maxWidth: 600,
          background: "#fff",
          borderRadius: 14,
          breakInside: "avoid",
          pageBreakInside: "avoid",
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
          Cost Summary | สรุปราคาประมาณการ
        </div>
        <table
          style={{
            width: "100%",
            marginBottom: 12,
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            {rooms.map((room, index) => (
              <tr key={room.id}>
                <td
                  style={{
                    ...tableCellStyle,
                    fontWeight: "bold",
                    width: "60%",
                    border: "none",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {room.name} (
                  {room.type === "indoor"
                    ? "ภายใน"
                    : room.type === "outdoor"
                    ? "ภายนอก"
                    : room.type === "pool"
                    ? "สระน้ำ"
                    : "ห้องน้ำ"}
                  : {room.area} ตร.ม.):
                </td>
                <td
                  style={{
                    ...tableCellStyle,
                    textAlign: "right" as const,
                    width: "40%",
                    border: "none",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {room.price.toLocaleString()} บาท
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: "1px solid #e5e7eb", margin: "12px 0" }}></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            ...contentStyle,
            marginTop: 16,
          }}
        >
          <div>
            <b>Total Area</b>
            <br />
            พื้นที่ทั้งหมด
          </div>
          <div>{totalArea?.toFixed(2)} ตร.ม.</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            ...contentStyle,
            marginTop: 16,
          }}
        >
          <div>
            <b>Estimated Construction Cost (Main Building)</b>
            <br />
            ราคาประมาณการก่อสร้าง (หลังหลัก)
          </div>
          <div>{totalConstructionCost?.toLocaleString()} บาท</div>
        </div>
        {hasMultipleBuildings &&
          additionalBuildingCount &&
          additionalBuildingCount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                ...contentStyle,
                marginTop: 16,
              }}
            >
              <div>
                <b>Additional Buildings</b>
                <br />
                มีบ้านมากกว่า 1 หลัง (10% ของค่าออกแบบ)
              </div>
              <div>{additionalBuildingCost?.toLocaleString()} บาท</div>
            </div>
          )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            ...contentStyle,
            marginTop: 16,
          }}
        >
          <div>
            <b>Total Construction Cost</b>
            <br />
            ราคาก่อสร้างรวมทั้งหมด
          </div>
          <div>
            {(
              totalConstructionCost! + (additionalBuildingCost || 0)
            ).toLocaleString()} {" "}
            บาท
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            ...contentStyle,
            marginTop: 16,
          }}
        >
          <div>
            <b>Design & Development Fee (MIB {mibPercent}%)</b>
            <br />
            ค่าออกแบบเขียนแบบพัฒนาแบบ (MIB {mibPercent}%)
          </div>
          <div>{designFee?.toLocaleString()} บาท</div>
        </div>
        <div style={{ borderTop: "1px solid #e5e7eb", margin: "16px 0" }}></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            ...contentStyle,
            fontWeight: "bold",
            fontSize: 13,
            marginTop: 16,
          }}
        >
          <div>
            Grand Total{" "}
            {hasMultipleBuildings &&
            additionalBuildingCount &&
            additionalBuildingCount > 0
              ? "(Including " +
                (additionalBuildingCount + 1) +
                " Buildings & Design Fee)"
              : "(Including Design Fee)"}
            <br />
            รวมทั้งหมด{" "}
            {hasMultipleBuildings &&
            additionalBuildingCount &&
            additionalBuildingCount > 0
              ? "(รวม " + (additionalBuildingCount + 1) + " หลัง และค่าออกแบบ)"
              : "(รวมค่าออกแบบ)"}
          </div>
          <div>{grandTotal?.toLocaleString()} บาท</div>
        </div>
      </div>
    </div>
  );
};

export default BuildingOverview;
