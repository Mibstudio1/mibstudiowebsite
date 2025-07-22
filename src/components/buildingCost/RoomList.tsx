import { ROOM_TYPES } from "@/constants/BuildingCost";
import { RoomListProps } from "@/interfaces/buildingCost";
import React from "react";

const RoomList = ({ rooms, deleteRoom }: RoomListProps) => {
  if (rooms.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-200"
          style={{ borderLeft: `6px solid ${room.color}` }}
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                {room.name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                {ROOM_TYPES[room.type].name} • {room.width}×{room.height} ={" "}
                {room.area} ตร.ม.
              </p>
              <p className="text-sm sm:text-lg font-bold text-green-600 mt-1 sm:mt-2">
                {room.price.toLocaleString()} บาท
              </p>
            </div>
            <button
              onClick={() => deleteRoom(room.id)}
              className="bg-red-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full hover:bg-red-600 font-bold text-xs sm:text-base flex-shrink-0"
              title="ลบ | Delete"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
