import { AddTaskFormProps } from "@/interfaces/taskManage";
import React, { FC } from "react";

const AddTaskForm: FC<AddTaskFormProps> = ({
  activeTab,
  activeCategory,
  taskOptions,
  addTask,
  currentText,
  taskForm,
  setTaskForm,
  setShowAddTask,
  handleCategoryChange,
}) => {
  return (
    <div
      className={`mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300`}
    >
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800">
          Add Task to: {activeTab?.title}
        </h4>
        <p className="text-sm text-gray-600">{activeTab?.subtitle}</p>
      </div>

      {/* Category Selection for Add Task */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          เลือกประเภทงาน / Select Task Category
        </label>
        <select
          value={activeCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 hover:border-gray-300 bg-gray-50/50 text-black"
        >
          {taskOptions.map((category) => (
            <option key={category.category} value={category.category}>
              {category.title} - {category.subtitle}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={addTask} className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder={currentText.th.newTaskPlaceholder}
          value={taskForm.name}
          onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
          className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 flex-1 min-w-60 text-black placeholder-gray-500"
          required
        />
        <input
          type="number"
          placeholder={currentText.th.daysPlaceholder}
          value={taskForm.days}
          onChange={(e) =>
            setTaskForm({
              ...taskForm,
              days: e.target.value,
            })
          }
          className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 w-32 text-black placeholder-gray-500"
          min="0"
        />
        <button
          type="submit"
          className={`bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:opacity-90 font-semibold shadow-lg`}
        >
          <p>Add</p>
          <p className="text-xs opacity-90">เพิ่ม</p>
        </button>
        <button
          type="button"
          onClick={() => {
            setShowAddTask(false);
            setTaskForm({
              name: "",
              days: "",
              category: activeCategory,
            });
          }}
          className="bg-gray-400 text-white px-6 py-3 rounded-xl hover:bg-gray-500 font-semibold"
        >
          <p>Cancel</p>
          <p className="text-xs opacity-90">ยกเลิก</p>
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;
