import { LangTaskManage, Task, TaskForm, TaskOption } from "./timeline";

interface CurrentText {
  th: LangTaskManage;
  en: LangTaskManage;
}

export interface HeaderTaskProps {
  setShowAddTask: (showAddtask: boolean) => void;
  showAddTask: boolean;
  currentText: CurrentText;
}

export interface CategoryTabProps {
  taskOptions: TaskOption[];
  handleCategoryChange: (categoryId: string) => void;
  activeCategory: string;
}

export interface AddTaskFormProps {
  activeTab?: TaskOption;
  activeCategory: string;
  taskOptions: TaskOption[];
  addTask: (e: React.FormEvent) => void;
  currentText: CurrentText;
  taskForm: TaskForm;
  setTaskForm: (form: TaskForm) => void;
  setShowAddTask: (showAddTask: boolean) => void;
  handleCategoryChange: (categoryId: string) => void;
}

export interface TaskActiveCateProps {
  activeTab?: TaskOption;
  getTasksForCategory: (categoryId: string) => Task[];
  activeCategory: string;
  updateTask: (taskId: number, days: string) => void;
  deleteTask: (taskId: number, name: string) => void;
}
