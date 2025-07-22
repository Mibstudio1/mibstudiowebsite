import { useGetTimeline } from "@/hooks/useGetTimeline";
import { Task, TaskManagementProps } from "@/interfaces/timeline";
import React, { useState } from "react";
import HeaderTaskManage from "../taskManage/HeaderTaskManage";
import CategoryTab from "../taskManage/CategoryTab";
import AddTaskForm from "../taskManage/AddTaskForm";
import TaskActiveCate from "../taskManage/TaskActiveCate";

// กำหนด categories คงที่ (3 หมวดหลัก) ให้ตรงกับ TaskOption interface
const categories = [
  { category: "architechture", title: "Architectural & Engineering Design", subtitle: "งานออกแบบ สถาปัตย์วิศวกร", tasks: [] },
  { category: "supervistion", title: "Construction Supervision Services", subtitle: "บริการควบคุมงานก่อนสร้าง", tasks: [] },
  { category: "contracting", title: "Construction Contracting Services", subtitle: "บริการ รับเหมา ก่อสร้าง หรือ ว่าจ้างก่อสร้าง", tasks: [] },
];

const TaskManagement = ({
  currentText,
  taskForm,
  setTaskForm,
  workingTasks,
  setWorkingTasks,
  setSelectedTasks,
}: TaskManagementProps) => {
  const [activeCategory, setActiveCategory] = useState("architechture");
  const [showAddTask, setShowAddTask] = useState(false);
  const { addTaskOption, deleteTaskOption } = useGetTimeline();

  // Get tasks for the active category
  const getTasksForCategory = (categoryId: string) => {
    return workingTasks.filter((task) => task.category === categoryId);
  };

  const activeTab = categories.find((cat) => cat.category === activeCategory);

  // Handle category change when adding task
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Reset task form when changing category
    setTaskForm({ name: "", days: "", category: categoryId });
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      id: Math.max(0, ...workingTasks.map((t) => t.id)) + 1,
      name: taskForm.name,
      days: taskForm.days,
      category: taskForm.category,
    };

    const newTaskOption = {
      name: taskForm.name,
      title: activeTab?.title || "",
      subtitle: activeTab?.subtitle || "",
      category: activeTab?.category || "",
    };

    setWorkingTasks([...workingTasks, newTask]);
    await addTaskOption(newTaskOption);
    setTaskForm({ name: "", days: "", category: taskForm.category });
    setShowAddTask(false);
  };

  const updateTask = (taskId: number, days: string) => {
    setWorkingTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, days: days } : task))
    );
  };

  const deleteTask = async (taskId: number, name: string) => {
    setWorkingTasks((prev) => prev.filter((task) => task.id !== taskId));
    // Remove from selected tasks if it was selected
    setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    await deleteTaskOption(name);
  };

  return (
    <div className="group">
      <div className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
        {/* Enhanced header */}
        <HeaderTaskManage
          setShowAddTask={setShowAddTask}
          showAddTask={showAddTask}
          currentText={currentText}
        />

        <div className="p-8">
          {/* Category Tabs */}
          <CategoryTab
            taskOptions={categories}
            handleCategoryChange={handleCategoryChange}
            activeCategory={activeCategory}
          />

          {/* Add Task Form */}
          {showAddTask && (
            <AddTaskForm
              activeTab={activeTab}
              activeCategory={activeCategory}
              taskOptions={categories}
              addTask={addTask}
              currentText={currentText}
              taskForm={taskForm}
              setTaskForm={setTaskForm}
              setShowAddTask={setShowAddTask}
              handleCategoryChange={handleCategoryChange}
            />
          )}

          {/* Tasks for Active Category */}
          <TaskActiveCate
            activeTab={activeTab}
            getTasksForCategory={getTasksForCategory}
            activeCategory={activeCategory}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
