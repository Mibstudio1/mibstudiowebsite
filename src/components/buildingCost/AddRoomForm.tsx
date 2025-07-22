import { ROOM_TYPES } from "@/constants/BuildingCost";
import { AddRoomFormProps } from "@/interfaces/buildingCost";
import React from "react";

const AddRoomForm = ({ newRoom, setNewRoom, addRoom }: AddRoomFormProps) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-dashed border-gray-300">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-800">
          Add Room
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm">เพิ่มพื้นที่</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="ชื่อห้อง/พื้นที่"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          className="col-span-1 sm:col-span-2 lg:col-span-1 border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black text-sm sm:text-base"
        />

        <select
          value={newRoom.type}
          onChange={(e) =>
            setNewRoom({
              ...newRoom,
              type: e.target.value as keyof typeof ROOM_TYPES,
            })
          }
          className="col-span-1 sm:col-span-2 lg:col-span-1 border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black text-sm sm:text-base"
        >
          {Object.entries(ROOM_TYPES).map(([key, type]) => (
            <option key={key} value={key}>
              {type.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="ความกว้าง (ม.)"
          value={newRoom.width || ""}
          onChange={(e) =>
            setNewRoom({ ...newRoom, width: Number(e.target.value) })
          }
          className="border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black text-sm sm:text-base"
        />

        <input
          type="number"
          placeholder="ความยาว (ม.)"
          value={newRoom.height || ""}
          onChange={(e) =>
            setNewRoom({ ...newRoom, height: Number(e.target.value) })
          }
          className="border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black text-sm sm:text-base"
        />

        <input
          type="number"
          placeholder="ราคา/ตร.ม."
          value={newRoom.pricePerSqm || ""}
          onChange={(e) =>
            setNewRoom({
              ...newRoom,
              pricePerSqm: Number(e.target.value) || undefined,
            })
          }
          className="border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black text-sm sm:text-base"
        />

        <button
          onClick={addRoom}
          className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-gray-800 hover:to-gray-900 font-semibold shadow-lg transition-all duration-200 text-sm sm:text-base"
        >
          <p>Add</p>
          <p className="text-xs opacity-90">เพิ่ม</p>
        </button>
      </div>
    </div>
  );
};

export default AddRoomForm;
