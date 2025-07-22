import { CSSProperties } from "react";
import { PdfForm, Room, Task } from "./timeline";

export interface ProjectInformationProps {
  contentStyle: CSSProperties;
  pdfForm?: PdfForm;
}
export interface TimelineTaskProps {
  workingTasks: Task[];
  selectedTasks: number[];
  tableHeaderStyle: CSSProperties;
  tableCellStyle: CSSProperties;
}

export interface BuildingOverviewProps {
  floorPlanImage: string;
  rooms: Room[];
  tableCellStyle: CSSProperties;
  contentStyle: CSSProperties;
  totalArea?: number;
  totalConstructionCost?: number;
  hasMultipleBuildings?: boolean;
  additionalBuildingCount?: number;
  additionalBuildingCost?: number;
  mibPercent: number;
  designFee?: number;
  grandTotal?: number;
}

export interface ExportButtonProps {
  handleExportPDF: () => void;
  isLoading: boolean;
  isCapturing: boolean;
  selectedTasks: any[]; // ถ้า type ของ task มีอยู่แล้วให้ใส่แทน any เช่น `Task[]`
  currentText: {
    en: { creating: string; downloadPDF: string };
    th: { creating: string; downloadPDF: string };
  };
}
