import { PDFFormProps } from "@/interfaces/timeline";
import React, { FC } from "react";

const ProjectNameNOwner: FC<PDFFormProps> = ({
  currentText,
  pdfForm,
  setPdfForm,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <label className="block text-md font-semibold text-black">
          {currentText.en.projectName}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <p className="text-sm mb-2 text-gray-600">
          {currentText.th.projectName}
        </p>
        <input
          type="text"
          placeholder={currentText.th.projectNamePlaceholder}
          value={pdfForm.name}
          onChange={(e) => setPdfForm({ ...pdfForm, name: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-black placeholder-gray-400 transition-all duration-300 hover:border-gray-300 bg-gray-50/50"
          required
        />
      </div>
      <div>
        <label className="block text-md font-semibold text-black">
          {currentText.en.projectOwnerName}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <p className="text-sm mb-2 text-gray-600">
          {currentText.th.projectOwnerName}
        </p>
        <input
          type="text"
          placeholder={currentText.th.projectOwnerNamePlaceholder}
          value={pdfForm.projectOwner}
          onChange={(e) =>
            setPdfForm({ ...pdfForm, projectOwner: e.target.value })
          }
          className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:border-gray-500 text-black placeholder-gray-500"
          required
        />
      </div>
    </div>
  );
};

export default ProjectNameNOwner;
