import { ExportButtonProps } from "@/interfaces/exportPdf";
import React, { FC } from "react";

const ExportButton: FC<ExportButtonProps> = ({
  handleExportPDF,
  isLoading,
  isCapturing,
  selectedTasks,
  currentText,
}) => {
  return (
    <button
      onClick={handleExportPDF}
      disabled={isLoading || isCapturing || selectedTasks.length === 0}
      className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2 mx-auto transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {isLoading || isCapturing ? (
        <>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          <div>{currentText.en.creating}</div>
          <div className="text-sm opacity-90">{currentText.th.creating}</div>
        </>
      ) : (
        <>
          <div>{currentText.en.downloadPDF}</div>
          <div className="text-sm opacity-90">{currentText.th.downloadPDF}</div>
        </>
      )}
    </button>
  );
};

export default ExportButton;
