import { PDFFormProps } from "@/interfaces/timeline";
import React from "react";

const Description = ({ currentText, pdfForm, setPdfForm }: PDFFormProps) => {
  return (
    <div>
      <label className="block text-md font-semibold text-black">
        {currentText.en.description}
      </label>
      <p className="text-sm mb-2  text-gray-600">
        {currentText.th.description}
      </p>
      <textarea
        placeholder={currentText.th.descriptionPlaceholder}
        value={pdfForm.description}
        onChange={(e) =>
          setPdfForm({ ...pdfForm, description: e.target.value })
        }
        className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:border-gray-500 text-black placeholder-gray-500"
      />
    </div>
  );
};

export default Description;
