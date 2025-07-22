import { LangSummary, PdfForm, Task } from "./timeline";

interface CurrentText {
  en: LangSummary;
  th: LangSummary;
}

export interface ProjectInfoProps {
  currentText: CurrentText;
  pdfForm: PdfForm;
}

interface ServiceLabels {
  id: number;
  serice: {
    th: string;
    en: string;
  };
}

export interface SelectServiceProps {
  serviceLabels: ServiceLabels[];
  pdfForm: PdfForm;
}

export interface SelectTaskProps {
  selectedTasksDetails: Task[];
}

export interface TotalSummaryProps {
  currentText: CurrentText;
  selectedTasksDetails: Task[];
  getTotalDays: () => number;
}
