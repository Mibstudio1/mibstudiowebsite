import { TaskActiveCateProps } from "@/interfaces/taskSelect";
import React, { FC } from "react";

const TaskActiveCate: FC<TaskActiveCateProps> = ({
  activeTab,
  getTasksForCategory,
  activeCategory,
  selectedTasks,
  toggleTaskSelection,
  currentText,
}) => {
  return (
    <div
      className={`bg-gradient-to-r ${
        activeTab?.bgColor || "from-gray-50 to-gray-100"
      } rounded-xl p-4 border-2 ${activeTab?.borderColor || "border-gray-200"}`}
    >
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <span
          className={`w-4 h-4 bg-gradient-to-r ${
            activeTab?.color || "from-gray-600 to-gray-700"
          } rounded-full mr-2`}
        ></span>
        {activeTab?.name} Tasks
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {getTasksForCategory(activeCategory).map((task, index) => (
          <label
            key={task.id}
            className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-300 transition-all duration-200 bg-white"
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedTasks.includes(task.id)}
                onChange={() => toggleTaskSelection(task.id)}
                className="w-5 h-5 text-gray-600 rounded-md focus:ring-gray-500 focus:ring-2 focus:ring-offset-2 border-2 border-gray-300 checked:bg-gray-600 checked:border-gray-600 transition-all duration-200"
              />
            </div>
            <span className="text-sm font-medium text-black flex-1">
              {task.name}
            </span>
            <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {Number(task.days)} {currentText.th.days} ({currentText.en.days})
            </span>
          </label>
        ))}
      </div>

      {getTasksForCategory(activeCategory).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No tasks in this category yet</p>
          <p className="text-sm">ยังไม่มีงานในหมวดหมู่นี้</p>
        </div>
      )}
    </div>
  );
};

export default TaskActiveCate;
