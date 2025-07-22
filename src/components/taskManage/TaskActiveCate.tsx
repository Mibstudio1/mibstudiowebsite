import { TaskActiveCateProps } from "@/interfaces/taskManage";
import React, { FC } from "react";

const TaskActiveCate: FC<TaskActiveCateProps> = ({
  activeTab,
  getTasksForCategory,
  activeCategory,
  updateTask,
  deleteTask,
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300`}
    >
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <span
          className={`w-4 h-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full mr-2`}
        ></span>
        {activeTab?.category} Tasks
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getTasksForCategory(activeCategory).map((task, index) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <span
                  className={`text-sm font-bold w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full flex items-center justify-center mr-3`}
                >
                  {index + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-black">
                  {task.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={task.days}
                  placeholder="0"
                  onChange={(e) => updateTask(task.id, e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-3 py-2 w-20 text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                  min="0"
                />
                <span className="text-sm text-black font-medium">วัน</span>
                <button
                  onClick={() => deleteTask(task.id, task.name)}
                  className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 font-bold shadow-lg"
                  title="ลบหัวข้อ"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
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
