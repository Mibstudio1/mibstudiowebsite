import { PDFFormProps } from "@/interfaces/timeline";
import React from "react";

const ClientNDate = ({ currentText, pdfForm, setPdfForm }: PDFFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <label className="block text-md font-semibold text-black">
          {currentText.en.client}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <p className="text-sm mb-2 text-gray-600">{currentText.th.client}</p>
        <input
          type="text"
          placeholder={currentText.th.clientPlaceholder}
          value={pdfForm.client}
          onChange={(e) => setPdfForm({ ...pdfForm, client: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:border-gray-500 text-black placeholder-gray-500"
          required
        />
      </div>
      <div>
        <label className="block text-md font-semibold text-black">
          {currentText.en.documentDate}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <p className="text-sm mb-2 text-gray-600">
          {currentText.th.documentDate}
        </p>
        <input
          type="date"
          value={pdfForm.documentDate}
          onChange={(e) =>
            setPdfForm({ ...pdfForm, documentDate: e.target.value })
          }
          className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:border-gray-500 text-black"
          required
        />
      </div>
    </div>
  );
};

export default ClientNDate;
