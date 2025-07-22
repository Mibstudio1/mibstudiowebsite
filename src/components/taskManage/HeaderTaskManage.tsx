import { HeaderTaskProps } from "@/interfaces/taskManage";
import React, { FC } from "react";

const HeaderTaskManage: FC<HeaderTaskProps> = ({
  setShowAddTask,
  showAddTask,
  currentText,
}) => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-6 flex justify-between items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10"></div>
      <div className="relative flex items-center space-x-3">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Set Task Durations (Days)
          </h2>
          <p className="text-gray-300 text-sm font-light">
            กำหนดระยะเวลาการดำเนินงาน (วัน)
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowAddTask(!showAddTask)}
        className="relative bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-semibold border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
      >
        <div className="text-sm">{currentText.en.addTask}</div>
        <div className="text-xs opacity-90">{currentText.th.addTask}</div>
      </button>
    </div>
  );
};

export default HeaderTaskManage;
