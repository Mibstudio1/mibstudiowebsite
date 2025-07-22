import { TotalSummaryProps } from "@/interfaces/summary";
import React, { FC } from "react";

const TotalSummary: FC<TotalSummaryProps> = ({
  currentText,
  selectedTasksDetails,
  getTotalDays,
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl p-6 text-center">
      <h3 className="text-xl font-bold">{currentText.en.totalDays}</h3>
      <p className="text-lg font-bold mb-2 opacity-80">
        {currentText.th.totalDays}
      </p>
      <div className="text-4xl font-black mb-2 bg-white/20 backdrop-blur-sm rounded-xl py-3">
        {getTotalDays()} {currentText.th.days}
      </div>
      <p className="text-white/80 text-sm">
        (Calculated based on selected tasks {selectedTasksDetails.length} per
        item)
      </p>
      <p className="text-white/80 text-sm">
        (คำนวณจากงานที่เลือก {selectedTasksDetails.length} รายการ)
      </p>
    </div>
  );
};

export default TotalSummary;
