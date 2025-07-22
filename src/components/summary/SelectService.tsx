import { SelectServiceProps } from "@/interfaces/summary";
import React, { FC } from "react";

const SelectService: FC<SelectServiceProps> = ({ serviceLabels, pdfForm }) => {
  console.log("pdfForm", pdfForm);
  
  // Get unique service names from pdfForm.services
  const selectedServices = pdfForm.services.map(s => s.service);
  const uniqueServices = [...new Set(selectedServices)];
  
  return (
    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
          2
        </span>
        <div className="flex flex-col">
          <p>Service</p>
          <p className="text-sm opacity-90 text-gray-600">บริการที่เลือก</p>
        </div>
      </h3>

      <div className="space-y-3">
        {serviceLabels.map((item, index) => {
          const keys = [
            "architechture",
            "supervistion",
            "contracting",
          ] as const;
          const key = keys[index];

          // Find tasks for this service by matching service name
          const serviceTasks = pdfForm.services
            .filter((s) => {
              // Check if the service name contains the expected keywords
              const serviceName = s.service.toLowerCase();
              if (index === 0) {
                // Architectural & Engineering Design
                return serviceName.includes("architectural") || serviceName.includes("engineering") || serviceName.includes("design");
              } else if (index === 1) {
                // Construction Supervision Services
                return serviceName.includes("supervision");
              } else if (index === 2) {
                // Construction Contracting Services
                return serviceName.includes("contracting");
              }
              return false;
            })
            .map((s) => s.task);

          const tasksString = serviceTasks.join(", ");
          const value = tasksString ? tasksString : "ไม่ได้เลือก";

          return (
            <div
              key={key}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  {item.serice.en}
                </span>
                <span className="text-sm text-gray-600">{item.serice.th}</span>
              </div>
              <span className="text-gray-900 font-semibold text-right">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectService;
