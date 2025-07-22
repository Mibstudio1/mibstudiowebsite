import { ROOM_TYPES } from "@/constants/BuildingCost";
import { CostSummaryProps } from "@/interfaces/buildingCost";
import React from "react";

const CostSummary = ({
  rooms,
  totalArea,
  totalConstructionCost,
  designFee,
  grandTotal,
  mibCost,
  hasMultipleBuildings,
  additionalBuildingCount,
  additionalBuildingCost,
  onMultipleBuildingsChange,
  onAdditionalBuildingCountChange,
}: CostSummaryProps) => {
  if (rooms.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          Cost Summary
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm">สรุปราคาประมาณการ</p>
      </div>

      {/* Room breakdown */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex justify-between items-center py-1 sm:py-2 gap-2"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-700 flex-1 min-w-0">
              {room.name} ({ROOM_TYPES[room.type].name}: {room.area} ตร.ม.):
            </span>
            <span className="font-bold text-gray-800 text-xs sm:text-sm flex-shrink-0">
              {room.price.toLocaleString()} บาท
            </span>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-300 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-blue-600 text-sm sm:text-base">
              Total Area
            </span>
            <div className="text-xs text-gray-500">พื้นที่ทั้งหมด</div>
          </div>
          <span className="font-bold text-blue-800 text-sm sm:text-base">
            {totalArea.toFixed(2)} ตร.ม.
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-green-600 text-sm sm:text-base">
              Estimated Construction Cost (Main Building)
            </span>
            <div className="text-xs text-gray-500">
              ราคาประมาณการก่อสร้าง (หลังหลัก)
            </div>
          </div>
          <span className="font-bold text-green-800 text-sm sm:text-base">
            {totalConstructionCost.toLocaleString()} บาท
          </span>
        </div>

        {/* Additional buildings cost */}
        {hasMultipleBuildings && additionalBuildingCount > 0 && (
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-orange-600 text-sm sm:text-base">
                Additional Buildings ({additionalBuildingCount} × 10% of Design Fee)
              </span>
              <div className="text-xs text-gray-500">
                ราคาบ้านเพิ่มเติม ({additionalBuildingCount} × 10% ของค่าออกแบบ)
              </div>
            </div>
            <span className="font-bold text-orange-800 text-sm sm:text-base">
              {additionalBuildingCost.toLocaleString()} บาท
            </span>
          </div>
        )}

        {/* Total Construction Cost (including additional buildings) */}
        <div className="flex justify-between items-center border-t border-gray-300 pt-2">
          <div>
            <span className="font-semibold text-blue-600 text-sm sm:text-base">
              Total Construction Cost
            </span>
            <div className="text-xs text-gray-500">
              ราคาก่อสร้างรวมทั้งหมด
            </div>
          </div>
          <span className="font-bold text-blue-800 text-sm sm:text-base">
            {(totalConstructionCost + additionalBuildingCost).toLocaleString()} บาท
          </span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <span className="font-semibold text-purple-600 text-sm sm:text-base">
              Design & Development Fee (MIB ฿{(Math.round(Number(mibCost) * 100) / 100).toFixed(2)}%)
            </span>
            <div className="text-xs text-gray-500">
              ค่าออกแบบเขียนแบบพัฒนาแบบ (MIB ฿{(Math.round(Number(mibCost) * 100) / 100).toFixed(2)}%)
            </div>
          </div>
          <span className="font-bold text-purple-800 text-sm sm:text-base">
            {designFee.toLocaleString()} บาท
          </span>
        </div>

        {/* Multiple Buildings Option - Moved here */}
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasMultipleBuildings}
                onChange={(e) => {
                  onMultipleBuildingsChange?.(e.target.checked);
                }}
                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">
                มีบ้านมากกว่า 1 หลัง (10% ของค่าออกแบบ)
              </span>
            </label>
            
            {hasMultipleBuildings && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">จำนวนบ้านเพิ่มเติม:</span>
                                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={additionalBuildingCount}
                    onChange={(e) => {
                      onAdditionalBuildingCountChange?.(parseInt(e.target.value) || 0);
                    }}
                    className="w-16 border border-orange-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500 text-center text-black bg-white text-xs"
                  />
                <span className="text-xs text-gray-600">หลัง</span>
              </div>
            )}
          </div>
          
          {hasMultipleBuildings && additionalBuildingCount > 0 && (
            <div className="mt-2 p-2 bg-white rounded border border-orange-300">
              <p className="text-xs text-orange-700">
                <strong>หมายเหตุ:</strong> ราคาบ้านเพิ่มเติมคิดเป็น 10% ของค่าออกแบบ × จำนวนหลังที่เพิ่ม
              </p>
              <p className="text-xs text-orange-700 mt-1">
                คำนวณ: {designFee.toLocaleString()} × 10% × {additionalBuildingCount} หลัง = {additionalBuildingCost.toLocaleString()} บาท
              </p>
            </div>
          )}
        </div>

        <div className="border-t-2 border-gray-400 pt-2 sm:pt-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-base sm:text-xl font-bold text-gray-800">
                Grand Total {hasMultipleBuildings && additionalBuildingCount > 0 
                  ? `(Including ${additionalBuildingCount + 1} Buildings & Design Fee)`
                  : '(Including Design Fee)'}
              </span>
              <div className="text-xs text-gray-500">
                รวมทั้งหมด {hasMultipleBuildings && additionalBuildingCount > 0 
                  ? `(รวม ${additionalBuildingCount + 1} หลัง และค่าออกแบบ)`
                  : '(รวมค่าออกแบบ)'}
              </div>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-blue-600 flex-shrink-0">
              {grandTotal.toLocaleString()} บาท
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostSummary;
