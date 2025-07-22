import { categories } from "@/constants/defaultValue";
import { TaskSelectionProps } from "@/interfaces/timeline";
import React, { useState } from "react";
import HeaderTaskSelect from "../taskSelection/HeaderTaskSelect";
import CategoryTab from "../taskSelection/CategoryTab";
import TaskActiveCate from "../taskSelection/TaskActiveCate";

const TaskSelection = ({
  currentText,
  workingTasks,
  selectedTasks,
  toggleTaskSelection,
}: TaskSelectionProps) => {
  const [activeCategory, setActiveCategory] = useState("architechture");

  // Get tasks for the active category
  const getTasksForCategory = (categoryId: string) => {
    return workingTasks.filter((task) => task.category === categoryId);
  };

  const activeTab = categories.find((cat) => cat.id === activeCategory);

  return (
    <div className="group">
      <div className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
        {/* Enhanced header */}
        <HeaderTaskSelect />

        <div className="p-8">
          {/* Category Tabs */}
          <CategoryTab
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={categories}
          />

          {/* Tasks for Active Category */}
          <TaskActiveCate
            activeTab={activeTab}
            activeCategory={activeCategory}
            selectedTasks={selectedTasks}
            toggleTaskSelection={toggleTaskSelection}
            currentText={currentText}
            getTasksForCategory={getTasksForCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskSelection;
