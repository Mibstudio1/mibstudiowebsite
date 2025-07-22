import { serviceLabels } from "@/constants/summary";
import { SummaryProps } from "@/interfaces/timeline";
import React from "react";
import HeaderSummry from "../summary/HeaderSummry";
import ProjectInformation from "../summary/ProjectInformation";
import SelectService from "../summary/SelectService";
import SelectTask from "../summary/SelectTask";
import TotalSummary from "../summary/TotalSummary";

const Summary = ({
  currentText,
  getTotalDays,
  pdfForm,
  selectedTasks,
  workingTasks,
}: SummaryProps) => {
  // Get selected tasks with their details
  const selectedTasksDetails = workingTasks.filter(
    (task) => selectedTasks.includes(task.id) && task.days
  );

  return (
    <div className="group">
      <div className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
        {/* Enhanced header */}
        <HeaderSummry />

        <div className="p-6 sm:p-8 lg:p-10 space-y-8">
          {/* Project Information */}
          <ProjectInformation currentText={currentText} pdfForm={pdfForm} />

          {/* Selected Services */}
          <SelectService serviceLabels={serviceLabels} pdfForm={pdfForm} />

          {/* Selected Tasks */}
          <SelectTask selectedTasksDetails={selectedTasksDetails} />

          {/* Total Summary */}
          <TotalSummary
            currentText={currentText}
            selectedTasksDetails={selectedTasksDetails}
            getTotalDays={getTotalDays}
          />
        </div>
      </div>
    </div>
  );
};

export default Summary;
