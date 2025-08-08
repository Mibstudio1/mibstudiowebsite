export interface Room {
  id: number;
  name: string;
  type: "indoor" | "outdoor" | "pool" | "bathroom";
  width: number;
  height: number;
  area: number;
  price: number;
  x: number;
  y: number;
  color: string;
}

export interface BuildingCost {
  rooms: Room[];
  totalArea: number;
  totalConstructionCost: number;
  designFee: number;
  grandTotal: number;
  hasMultipleBuildings: boolean;
  additionalBuildingCount: number;
  additionalBuildingCost: number;
}

export interface BuildingCostEstimatorProps {
  onCostDataChange?: (data: BuildingCost) => void;
  calCostOfServices: () => string;
}

export interface NewRoom {
  name: string;
  type: "indoor" | "outdoor" | "pool" | "bathroom";
  width: number;
  height: number;
  pricePerSqm?: number;
}

export interface LangExportPdf {
  creating: string;
  downloadPDF: string;
}

export interface ExportPdfProps {
  exportPDF: () => void;
  isLoading: boolean;
  selectedTasks: number[];
  currentText: {
    th: LangExportPdf;
    en: LangExportPdf;
  };
  pdfForm?: PdfForm;
  rooms?: Room[];
  totalArea?: number;
  totalConstructionCost?: number;
  designFee?: number;
  grandTotal?: number;
  mibCost?: string;
  hasMultipleBuildings?: boolean;
  additionalBuildingCount?: number;
  additionalBuildingCost?: number;
  workingTasks?: Task[];
}

export interface LangPDFForm {
  projectInfo: string;
  projectName: string;
  projectNamePlaceholder: string;
  projectOwnerName: string;
  projectOwnerNamePlaceholder: string;
  client: string;
  clientPlaceholder: string;
  documentDate: string;
  location: string;
  locationPlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  serviceSelection: string;
}

export interface ServiceItem {
  service: string;
  task: string;
  price: string;
  id?: number;
}

export interface PDFFormProps {
  currentText: {
    th: LangPDFForm;
    en: LangPDFForm;
  };
  pdfForm: {
    name: string;
    projectOwner: string;
    client: string;
    documentDate: string;
    location: string;
    description: string;
    architechture: string;
    supervistion: string;
    contracting: string;
    services: ServiceItem[];
  };
  setPdfForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      projectOwner: string;
      client: string;
      documentDate: string;
      location: string;
      description: string;
      architechture: string;
      supervistion: string;
      contracting: string;
      services: ServiceItem[];
    }>
  >;
}

export interface Task {
  id: number;
  name: string;
  days: string;
  category: string;
  status?: string;
}

export interface LangSummary {
  totalDays: string;
  days: string;
  calculated: string;
  projectName: string;
  documentDate: string;
  projectOwnerName: string;
  projectInfo: string;
  location: string;
  client: string;
}

export interface SummaryProps {
  currentText: {
    en: LangSummary;
    th: LangSummary;
  };
  getTotalDays: () => number;
  pdfForm: {
    name: string;
    projectOwner: string;
    client: string;
    documentDate: string;
    location: string;
    description: string;
    architechture: string;
    supervistion: string;
    contracting: string;
    services: ServiceItem[];
  };
  selectedTasks: number[];
  workingTasks: Task[];
}

export interface LangTaskManage {
  duration: string;
  addTask: string;
  newTaskPlaceholder: string;
  daysPlaceholder: string;
}

export interface TaskForm {
  name: string;
  days: string;
  category: string;
}

export interface TaskManagementProps {
  currentText: {
    th: LangTaskManage;
    en: LangTaskManage;
  };
  taskForm: TaskForm;
  setTaskForm: (form: TaskForm) => void;
  workingTasks: Task[];
  setWorkingTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setSelectedTasks: React.Dispatch<React.SetStateAction<number[]>>;
}

export interface LangTakeSelect {
  selectTasks: string;
  days: string;
}

export interface TaskSelectionProps {
  currentText: {
    th: LangTakeSelect;
    en: LangTakeSelect;
  };
  workingTasks: Task[];
  selectedTasks: number[];
  toggleTaskSelection: (taskId: number) => void;
}

export interface LangHeader {
  title: string;
}

export interface TextContent {
  en: LangHeader;
  th: LangHeader;
}

export interface TaskOption {
  title: string;
  subtitle: string;
  category: string;
  tasks: string[];
}
export interface TaskOptionInsert {
  name: string;
  title: string;
  subtitle: string;
  category: string;
}

export interface Project {
  id: number;
  name: string;
  client: string;
  documentDate: string;
  // duration: number;
  location: string;
  description: string;
  architechture: string;
  supervistion: string;
  contracting: string;
  tasks: Task[];
}

export interface PdfForm {
  name: string;
  projectOwner: string;
  client: string;
  documentDate: string;
  // duration: string;
  location: string;
  description: string;
  architechture: string;
  supervistion: string;
  contracting: string;
  services: ServiceItem[];
}

export interface UseGetValueProps {
  // defaultTasks: string[];
  pdfForm: PdfForm;
  // setPdfForm: React.Dispatch<React.SetStateAction<PdfForm>>;
  selectedTasks: number[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // setPdfUrl: React.Dispatch<React.SetStateAction<string>>;
  workingTasks: Task[];
  buildingCostData: BuildingCost;
}
