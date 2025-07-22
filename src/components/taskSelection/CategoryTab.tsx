import { CategoryTabProps } from "@/interfaces/taskSelect";
import React, { FC } from "react";

const CategoryTab: FC<CategoryTabProps> = ({
  setActiveCategory,
  activeCategory,
  categories,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex-1 min-w-0 ${
            activeCategory === category.id
              ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
              : `bg-gray-100 text-gray-700 hover:bg-gray-200`
          }`}
        >
          <div className="text-center">
            <div className="text-sm font-bold">{category.name}</div>
            <div className="text-xs opacity-90">{category.subtitle}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CategoryTab;
