"use client";

import { useState, useEffect, useRef } from "react";
import PDFForm from "@/components/timeline/PDFForm";
import BuildingCostEstimator from "@/components/timeline/BuildingCostEstimator";
import TaskManagement from "@/components/timeline/TaskManagement";
import TaskSelection from "@/components/timeline/TaskSelection";
import Summary from "@/components/timeline/Summary";
import ExportPdf from "@/components/timeline/ExportPdf";
import { text } from "@/utils/lang";
import { useGetValue } from "@/hooks/useGetValue";
import { Room, Task } from "@/interfaces/timeline";
import { useGetTimeline } from "@/hooks/useGetTimeline";
import { useRouter } from "next/navigation";
// เพิ่ม import สำหรับหน้าใหม่
import DocumentManager from "@/components/timeline/DocumentManager";

interface BuildingCost {
  rooms: Room[];
  totalArea: number;
  totalConstructionCost: number;
  designFee: number;
  grandTotal: number;
  hasMultipleBuildings: boolean;
  additionalBuildingCount: number;
  additionalBuildingCost: number;
}
interface ServiceItem {
  service: string;
  task: string;
  price: string;
}

console.log = () => null;

export default function Home() {
  const router = useRouter();
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  // const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // Default tasks for working with (without saving to database)
  const [workingTasks, setWorkingTasks] = useState<Task[]>([]);
  const { taskOptions } = useGetTimeline();

  const handleHomeClick = () => {
    router.push("/");
  };

  // Building cost estimator data
  const [buildingCostData, setBuildingCostData] = useState<BuildingCost>({
    rooms: [],
    totalArea: 0,
    totalConstructionCost: 0,
    designFee: 0,
    grandTotal: 0,
    hasMultipleBuildings: false,
    additionalBuildingCount: 0,
    additionalBuildingCost: 0,
  });

  // PDF Form ref for scrolling
  const pdfFormRef = useRef<HTMLDivElement>(null);

  // PDF Form states (for direct PDF creation without saving project)
  const [pdfForm, setPdfForm] = useState({
    name: "",
    projectOwner: "",
    client: "",
    documentDate: "",
    // duration: "",
    location: "",
    description: "",
    architechture: "",
    supervistion: "",
    contracting: "",
    services: [] as ServiceItem[],
  });
  const { exportPDF } = useGetValue({
    pdfForm,
    selectedTasks,
    setIsLoading,
    workingTasks,
    buildingCostData,
  });

  const [taskForm, setTaskForm] = useState({
    name: "",
    days: "",
    category: "architechture",
  });

  const currentText = text;

  useEffect(() => {
    let cur = 1;
    const initialTasks: Task[] = taskOptions.flatMap((task, i) =>
      task.tasks.map((name, j) => ({
        id: cur++,
        name,
        days: "0",
        category: task.category,
      }))
    );
    setWorkingTasks(initialTasks);
  }, [taskOptions]);

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getTotalDays = () => {
    return workingTasks
      .filter((task) => selectedTasks.includes(task.id))
      .reduce((sum, task) => sum + Number(task.days), 0);
  };

  const calCostOfServices = (services: ServiceItem[]) => {
    const total = services.reduce((acc, cur) => {
      const percent = parseFloat(cur.price);
      return acc + (isNaN(percent) ? 0 : percent);
    }, 0);

    // คืนค่าเป็น string โดยไม่จำกัดทศนิยม แต่ตัดทศนิยมที่ไม่จำเป็นออก
    return total.toString();
  };

  // เพิ่ม state สำหรับ Tab
  const [activeTab, setActiveTab] = useState<'project' | 'document'>('project');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header with Home Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHomeClick}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>กลับหน้าแรก</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <h1 className="text-3xl font-bold text-gray-900">Project Timeline</h1>
          </div>
          <div className="w-32"></div> {/* Spacer to balance the layout */}
        </div>

        {/* Tab UI */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-200 ${activeTab === 'project' ? 'border-black text-black bg-white' : 'border-transparent text-gray-400 bg-gray-100'}`}
            onClick={() => setActiveTab('project')}
          >
            เครื่องมือจัดการโครงการ
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-200 ${activeTab === 'document' ? 'border-black text-black bg-white' : 'border-transparent text-gray-400 bg-gray-100'}`}
            onClick={() => setActiveTab('document')}
          >
            เครื่องมือจัดการเอกสาร
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === 'project' ? (
          <>
            <div ref={pdfFormRef} className="animate-fade-in-up">
              <PDFForm
                currentText={currentText}
                pdfForm={pdfForm}
                setPdfForm={setPdfForm}
              />
            </div>
            <div className="animate-fade-in-up animate-delay-100">
              <BuildingCostEstimator
                onCostDataChange={setBuildingCostData}
                calCostOfServices={() => calCostOfServices(pdfForm.services)}
              />
            </div>
            <div className="animate-fade-in-up animate-delay-200">
              <TaskManagement
                currentText={currentText}
                taskForm={taskForm}
                setTaskForm={setTaskForm}
                workingTasks={workingTasks}
                setWorkingTasks={setWorkingTasks}
                setSelectedTasks={setSelectedTasks}
              />
            </div>
            {/* Task Selection */}
            <div className="animate-fade-in-up animate-delay-300">
              <TaskSelection
                currentText={currentText}
                workingTasks={workingTasks}
                selectedTasks={selectedTasks}
                toggleTaskSelection={toggleTaskSelection}
              />
            </div>
            {/* Summary */}
            <div className="animate-fade-in-up animate-delay-400">
              <Summary
                currentText={currentText}
                getTotalDays={getTotalDays}
                pdfForm={pdfForm}
                selectedTasks={selectedTasks}
                workingTasks={workingTasks}
              />
            </div>
            {/* Export PDF */}
            <div className="animate-fade-in-scale animate-delay-400">
              <ExportPdf
                exportPDF={exportPDF}
                isLoading={isLoading}
                selectedTasks={selectedTasks}
                currentText={currentText}
                pdfForm={pdfForm}
                rooms={buildingCostData.rooms}
                totalArea={buildingCostData.totalArea}
                totalConstructionCost={buildingCostData.totalConstructionCost}
                designFee={buildingCostData.designFee}
                grandTotal={buildingCostData.grandTotal}
                mibCost="3"
                hasMultipleBuildings={buildingCostData.hasMultipleBuildings}
                workingTasks={workingTasks}
              />
            </div>
          </>
        ) : (
          <DocumentManager />
        )}
      </div>
    </div>
  );
}
