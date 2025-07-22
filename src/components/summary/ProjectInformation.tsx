import { ProjectInfoProps } from "@/interfaces/summary";
import React, { FC } from "react";

const ProjectInformation: FC<ProjectInfoProps> = ({ currentText, pdfForm }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
          1
        </span>
        <div className="flex flex-col">
          <p>{currentText.en.projectInfo}</p>
          <p className="text-sm opacity-90 text-gray-600">
            {currentText.th.projectInfo}
          </p>
        </div>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-gray-700">
              <p className="text-base">{currentText.en.projectName}</p>
              <p className="text-sm opacity-80">{currentText.th.projectName}</p>
            </span>
            <p className="text-gray-900">{pdfForm.name || "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">
              <p className="text-base">{currentText.en.projectOwnerName}</p>
              <p className="text-sm opacity-80">
                {currentText.th.projectOwnerName}
              </p>
            </span>
            <p className="text-gray-900">{pdfForm.projectOwner || "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">
              <p className="text-base">{currentText.en.client}</p>
              <p className="text-sm opacity-80">{currentText.th.client}</p>
            </span>
            <p className="text-gray-900">{pdfForm.client || "-"}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-gray-700">
              <p className="text-base">{currentText.en.documentDate}</p>
              <p className="text-sm opacity-80">
                {currentText.th.documentDate}
              </p>
            </span>
            <p className="text-gray-900">{pdfForm.documentDate || "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">
              <p className="text-base">{currentText.en.location}</p>
              <p className="text-sm opacity-80">{currentText.th.location}</p>
            </span>
            <p className="text-gray-900">{pdfForm.location || "-"}</p>
          </div>
        </div>
      </div>
      {pdfForm.description && (
        <div className="mt-3">
          <span className="font-semibold text-gray-700">
            <p className="text-base">Project Detail</p>
            <p className="text-sm opacity-80">รายละเอียดโครงการ</p>
          </span>
          <p className="text-gray-900 mt-1">{pdfForm.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectInformation;
