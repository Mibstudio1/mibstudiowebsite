import { ROOM_TYPES } from "@/constants/BuildingCost";
import { FloorPlanProps } from "@/interfaces/buildingCost";
import React from "react";

const FloorPlan = ({
  rooms,
  calculateRoomDisplaySize,
  draggedRoom,
  handlePointerDown,
}: FloorPlanProps) => {
  if (rooms.length === 0) return null;

  return (
    <div>
      <div className="mb-4">
        <h3
          className="text-base sm:text-lg font-bold"
          style={{ color: "#1f2937" }}
        >
          Building Overview
        </h3>
        <p className="text-xs sm:text-sm" style={{ color: "#4b5563" }}>
          ภาพรวมอาคาร
        </p>
      </div>
      <p className="text-xs sm:text-sm mb-4" style={{ color: "#4b5563" }}>
        คลิกลากเพื่อย้ายตำแหน่งห้องภายในแผนผัง
      </p>

      <div
        data-floorplan="true"
        className="relative"
        style={{
          width: "100%",
          height: "450px",
          minHeight: "450px",
          maxWidth: "650px",
          margin: "0 auto",
          backgroundColor: "#fff",
          border: "none",
          overflow: "hidden",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        {rooms.map((room) => {
          const { displayWidth, displayHeight } =
            calculateRoomDisplaySize(room);

          return (
            <div
              key={room.id}
              className={`absolute flex flex-col items-center select-none`}
              style={{
                left: room.x,
                top: room.y,
                width: displayWidth,
                zIndex: draggedRoom === room.id ? 50 : 1,
              }}
              onPointerDown={(e) => handlePointerDown(e, room.id)}
            >
              {/* กรอบสี่เหลี่ยมเปล่า พร้อมข้อความด้านใน */}
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  width: displayWidth,
                  height: displayHeight,
                  backgroundColor: room.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="text-center text-xs font-bold" style={{ lineHeight: 1.3, color: "#1f2937" }}>
                  <div style={{ fontWeight: 700 }}>{room.name}</div>
                  <div style={{ fontWeight: 400 }}>{ROOM_TYPES[room.type].name}</div>
                  <div style={{ fontWeight: 400 }}>{room.width}×{room.height} ตร.ม.</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FloorPlan;
