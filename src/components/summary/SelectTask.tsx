import { SelectTaskProps } from "@/interfaces/summary";
import React, { FC } from "react";

const SelectTask: FC<SelectTaskProps> = ({ selectedTasksDetails }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
          3
        </span>
        <div className="flex flex-col">
          <p>Tasks</p>
          <p className="text-sm opacity-90 text-gray-600">งานที่เลือก</p>
        </div>
      </h3>
      {selectedTasksDetails.length > 0 ? (
        <div className="space-y-2">
          {selectedTasksDetails.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-200"
            >
              <span className="text-gray-700">{task.name}</span>
              <span className="font-semibold text-gray-700">
                {task.days} วัน
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 font-medium">No tasks selected</p>
          <p className="text-gray-400 text-sm mt-1">ยังไม่มีงานที่เลือก</p>
        </div>
      )}
    </div>
  );
};

export default SelectTask;
