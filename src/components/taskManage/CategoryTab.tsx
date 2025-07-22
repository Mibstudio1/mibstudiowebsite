import { CategoryTabProps } from "@/interfaces/taskManage";
import React, { FC } from "react";

const CategoryTab: FC<CategoryTabProps> = ({
  taskOptions,
  handleCategoryChange,
  activeCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
      {taskOptions.map((category) => (
        <button
          key={category.category}
          onClick={() => handleCategoryChange(category.category)}
          className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex-1 min-w-0 ${
            activeCategory === category.category
              ? `bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg`
              : `bg-gray-100 text-gray-700 hover:bg-gray-200`
          }`}
        >
          <div className="text-center">
            <div className="text-sm font-bold">{category.title}</div>
            <div className="text-xs opacity-90">{category.subtitle}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CategoryTab;
