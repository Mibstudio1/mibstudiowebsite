"use client";

import React, { useState, useMemo } from "react";
import BuildingCostHeader from "../buildingCost/BuildingCostHeader";
import { ROOM_DISPLAY_CONFIG, ROOM_TYPES } from "@/constants/BuildingCost";
import AddRoomForm from "../buildingCost/AddRoomForm";
import RoomList from "../buildingCost/RoomList";
import FloorPlan from "../buildingCost/FloorPlan";
import CostSummary from "../buildingCost/CostSummary";
import {
  BuildingCostEstimatorProps,
  NewRoom,
  Room,
} from "@/interfaces/timeline";

// ==============================
// MAIN COMPONENT
// ==============================

const BuildingCostEstimator = ({
  onCostDataChange,
  calCostOfServices,
}: BuildingCostEstimatorProps) => {
  // ==============================
  // STATE MANAGEMENT
  // ==============================
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<NewRoom>({
    name: "",
    type: "indoor",
    width: 0,
    height: 0,
    pricePerSqm: undefined,
  });
  const [draggedRoom, setDraggedRoom] = useState<number | null>(null);
  const [mibCost, setMibCost] = useState<string>("0");
  const [hasMultipleBuildings, setHasMultipleBuildings] =
    useState<boolean>(false);
  const [additionalBuildingCount, setAdditionalBuildingCount] =
    useState<number>(0);

  // ==============================
  // HELPER FUNCTIONS
  // ==============================
  const calculateRoomDisplaySize = (room: Room) => {
    const { maxWidth, maxHeight, minWidth, minHeight, scaleFactor } =
      ROOM_DISPLAY_CONFIG;

    // Calculate initial size based on real dimensions
    let baseWidth = room.width * scaleFactor;
    let baseHeight = room.height * scaleFactor;

    // Calculate aspect ratio
    const aspectRatio = room.width / room.height;

    // Scale down if either dimension exceeds maximum
    if (baseWidth > maxWidth || baseHeight > maxHeight) {
      const widthScale = maxWidth / baseWidth;
      const heightScale = maxHeight / baseHeight;
      const scale = Math.min(widthScale, heightScale);

      baseWidth *= scale;
      baseHeight *= scale;
    }

    // Ensure minimum dimensions while maintaining aspect ratio
    if (baseWidth < minWidth || baseHeight < minHeight) {
      const widthScale = minWidth / baseWidth;
      const heightScale = minHeight / baseHeight;
      const scale = Math.max(widthScale, heightScale);

      baseWidth *= scale;
      baseHeight *= scale;

      // Re-check maximum constraints after scaling up
      if (baseWidth > maxWidth || baseHeight > maxHeight) {
        const widthScale = maxWidth / baseWidth;
        const heightScale = maxHeight / baseHeight;
        const finalScale = Math.min(widthScale, heightScale);

        baseWidth *= finalScale;
        baseHeight *= finalScale;
      }
    }

    return {
      displayWidth: Math.round(baseWidth),
      displayHeight: Math.round(baseHeight)
    };
  };

  const calculateCosts = useMemo(() => {
    const totalArea = rooms.reduce((sum, room) => sum + room.area, 0);
    const totalConstructionCost = rooms.reduce(
      (sum, room) => sum + room.price,
      0
    );

    const designFeePercent = calCostOfServices();
    const designFee =
      totalConstructionCost * (parseFloat(designFeePercent) / 100); // MIB 7%

    // คำนวณราคาบ้านเพิ่มเติม (10% ของค่าออกแบบ)
    const additionalBuildingCost = hasMultipleBuildings
      ? designFee * 0.1 * additionalBuildingCount
      : 0;

    const grandTotal =
      totalConstructionCost + designFee + additionalBuildingCost;
    setMibCost(designFeePercent);

    // Debug: Log cost calculation
    console.log("BuildingCostEstimator Debug:", {
      rooms: rooms.length,
      totalArea,
      totalConstructionCost,
      designFeePercent,
      designFee,
      hasMultipleBuildings,
      additionalBuildingCount,
      additionalBuildingCost,
      grandTotal,
    });

    return {
      totalArea,
      totalConstructionCost,
      designFee,
      grandTotal,
      additionalBuildingCost,
    };
  }, [rooms, calCostOfServices, hasMultipleBuildings, additionalBuildingCount]);

  // ==============================
  // ROOM MANAGEMENT FUNCTIONS
  // ==============================
  const addRoom = () => {
    if (!newRoom.name || !newRoom.width || !newRoom.height) return;

    const area = newRoom.width * newRoom.height;
    // ใช้ราคาที่กรอกเอง หรือใช้ราคาเริ่มต้นจาก ROOM_TYPES
    const pricePerSqm =
      newRoom.pricePerSqm || ROOM_TYPES[newRoom.type].pricePerSqm;
    const room: Room = {
      id: Date.now(),
      name: newRoom.name,
      type: newRoom.type,
      width: newRoom.width,
      height: newRoom.height,
      area,
      price: area * pricePerSqm,
      x: 80 + (rooms.length % 4) * 180, // 4 columns layout for better space usage
      y: 80 + Math.floor(rooms.length / 4) * 140, // Multiple rows with better spacing
      color: ROOM_TYPES[newRoom.type].color,
    };

    setRooms([...rooms, room]);
    setNewRoom({
      name: "",
      type: "indoor",
      width: 0,
      height: 0,
      pricePerSqm: undefined,
    });
  };

  const deleteRoom = (id: number) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const updateRoomPosition = (
    id: number,
    x: number,
    y: number,
    containerWidth?: number,
    containerHeight?: number,
    roomWidth?: number,
    roomHeight?: number
  ) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === id) {
          let newX = x;
          let newY = y;

          if (containerWidth && containerHeight && roomWidth && roomHeight) {
            // จำกัดไม่ให้ห้องออกนอก container และเพิ่ม margin 20px จากขอบทุกด้าน
            newX = Math.max(20, Math.min(x, containerWidth - roomWidth - 20));
            newY = Math.max(20, Math.min(y, containerHeight - roomHeight - 20));
          }

          return { ...room, x: newX, y: newY };
        }
        return room;
      })
    );
  };

  // ==============================
  // DRAG & DROP FUNCTIONS
  // ==============================
  const handlePointerDown = (e: React.PointerEvent, roomId: number) => {
    e.preventDefault();
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    const containerRect =
      e.currentTarget.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const { displayWidth, displayHeight } = calculateRoomDisplaySize(room);

    setDraggedRoom(roomId);

    // Support both mouse and touch
    const clientX = e.clientX;
    const clientY = e.clientY;

    const initialOffset = {
      x: clientX - containerRect.left - room.x,
      y: clientY - containerRect.top - room.y,
    };

    let animationFrame: number;
    let lastUpdateTime = 0;

    const handlePointerMove = (moveE: PointerEvent) => {
      if (!containerRect) return;

      // Throttle updates for better performance
      const now = Date.now();
      if (now - lastUpdateTime < 16) return; // ~60fps
      lastUpdateTime = now;

      // ใช้ requestAnimationFrame เพื่อให้การเคลื่อนไหวสมูท
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        const newX = moveE.clientX - containerRect.left - initialOffset.x;
        const newY = moveE.clientY - containerRect.top - initialOffset.y;
        updateRoomPosition(
          roomId,
          newX,
          newY,
          containerRect.width,
          containerRect.height,
          displayWidth,
          displayHeight
        );
      });
    };

    const handlePointerUp = () => {
      setDraggedRoom(null);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      document.removeEventListener("pointermove", handlePointerMove as any);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove as any);
    document.addEventListener("pointerup", handlePointerUp);
  };

  // ==============================
  // COMPUTED VALUES
  // ==============================
  const {
    totalArea,
    totalConstructionCost,
    designFee,
    grandTotal,
    additionalBuildingCost,
  } = calculateCosts;

  // Update parent component when data changes
  React.useEffect(() => {
    if (onCostDataChange) {
      onCostDataChange({
        rooms,
        totalArea,
        totalConstructionCost,
        designFee,
        grandTotal,
        hasMultipleBuildings,
        additionalBuildingCount,
        additionalBuildingCost,
      });
    }
  }, [
    rooms,
    totalArea,
    totalConstructionCost,
    designFee,
    grandTotal,
    hasMultipleBuildings,
    additionalBuildingCount,
    additionalBuildingCost,
    onCostDataChange,
  ]);

  // ==============================
  // MAIN RENDER
  // ==============================
  return (
    <div className="group">
      <div className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
        <BuildingCostHeader />

        <div className="p-6 sm:p-8 lg:p-10 space-y-8">
          {/* {renderAddRoomForm()} */}
          <AddRoomForm
            newRoom={newRoom}
            setNewRoom={setNewRoom}
            addRoom={addRoom}
          />

          {/* Multiple Buildings Section - Moved to CostSummary */}

          <RoomList rooms={rooms} deleteRoom={deleteRoom} />
          <FloorPlan
            rooms={rooms}
            calculateRoomDisplaySize={calculateRoomDisplaySize}
            draggedRoom={draggedRoom}
            handlePointerDown={handlePointerDown}
          />
          <CostSummary
            rooms={rooms}
            totalArea={totalArea}
            totalConstructionCost={totalConstructionCost}
            designFee={designFee}
            grandTotal={grandTotal}
            mibCost={mibCost}
            hasMultipleBuildings={hasMultipleBuildings}
            additionalBuildingCount={additionalBuildingCount}
            additionalBuildingCost={additionalBuildingCost}
            onMultipleBuildingsChange={(checked: boolean) => {
              setHasMultipleBuildings(checked);
              if (!checked) {
                setAdditionalBuildingCount(0);
              }
            }}
            onAdditionalBuildingCountChange={(count: number) => {
              setAdditionalBuildingCount(count);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BuildingCostEstimator;
