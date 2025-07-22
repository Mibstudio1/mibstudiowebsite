import { LangTakeSelect, Task } from "./timeline";

interface ActiveTab {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  tasks: string[];
}

export interface CategoryTabProps {
  activeCategory: string;
  setActiveCategory: (activeCategory: string) => void;
  categories: ActiveTab[];
}

export interface TaskActiveCateProps {
  activeTab?: ActiveTab;
  getTasksForCategory: (categoryId: string) => Task[];
  activeCategory: string;
  selectedTasks: number[];
  toggleTaskSelection: (taskId: number) => void;
  currentText: {
    th: LangTakeSelect;
    en: LangTakeSelect;
  };
}
