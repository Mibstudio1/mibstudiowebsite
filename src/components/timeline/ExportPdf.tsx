import {
  contentStyle,
  tableCellStyle,
  tableHeaderStyle,
} from "@/constants/exportPdf";
import { ExportPdfProps } from "@/interfaces/timeline";
import React, { useState } from "react";
import PdfHeader from "../exportPdf/PdfHeader";
import ProjectInformation from "../exportPdf/ProjectInformation";
import TimelineTask from "../exportPdf/TimelineTask";
import BuildingOverview from "../exportPdf/BuildingOverview";
import Footer from "../exportPdf/Footer";
import ExportButton from "../exportPdf/ExportButton";

function getMibPercent(services: any[] = []) {
  const sum = services.reduce((sum, s) => {
    const val = parseFloat(s.price);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
  return Math.round(sum * 100) / 100;
}

const ExportPdf = ({
  exportPDF,
  isLoading,
  selectedTasks,
  currentText,
  pdfForm,
  rooms,
  totalArea,
  totalConstructionCost,
  designFee,
  grandTotal,
  hasMultipleBuildings,
  workingTasks = [],
}: ExportPdfProps) => {
  const [floorPlanImage, setFloorPlanImage] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState(false);
  const mibPercent = getMibPercent(pdfForm?.services);

  // Function to capture FloorPlan as image
  const captureFloorPlan = async () => {
    try {
      // Dynamic import dom-to-image
      // @ts-expect-error: dom-to-image ไม่มี type declaration
      const domtoimage = await import("dom-to-image");
      // Find the FloorPlan element
      const floorPlanElement = document.querySelector(
        '[data-floorplan="true"]'
      );
      if (floorPlanElement) {
        const dataUrl = await domtoimage.toPng(
          floorPlanElement as HTMLElement,
          {
            bgcolor: "#fff",
            quality: 1,
            style: {
              background: "#fff",
              "box-shadow": "none",
            },
          }
        );
        setFloorPlanImage(dataUrl);
      }
    } catch (error) {
      console.error("Error capturing FloorPlan:", error);
      setFloorPlanImage("");
    }
  };

  // Function to capture FloorPlan as image and then export PDF
  const handleExportPDF = async () => {
    setIsCapturing(true);
    setFloorPlanImage("");
    // wait for DOM update
    setTimeout(async () => {
      await captureFloorPlan();
      setTimeout(() => {
        setIsCapturing(false);
        exportPDF();
      }, 200); // wait a bit for image to be set
    }, 400); // delay for FloorPlan to render
  };

  return (
    <div className="group">
      <div className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
        <div className="p-6 sm:p-8 lg:p-10 text-center">
          {/* Hidden div for PDF content */}
          <div
            id="pdf-content"
            className="hidden"
            style={{
              fontFamily: "Noto Serif Thai, Arial, sans-serif",
              margin: 0,
              padding: 0,
            }}
          >
            {/* Remove all margin/padding for PDF edge-to-edge header */}
            <style>{`
              body, #pdf-content { margin: 0 !important; padding: 0 !important; }
              @page { margin: 0; }
            `}</style>
            {/* Header with Logo and Company Info */}
            <PdfHeader />

            {/* Project Information */}
            <ProjectInformation contentStyle={contentStyle} pdfForm={pdfForm} />

            {/* Project Timeline Header */}
            {selectedTasks && selectedTasks.length > 0 && workingTasks && (
              <div
                style={{
                  pageBreakBefore: "always",
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                  margin: "48px auto 32px auto",
                  padding: "0",
                  maxWidth: 700,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#222",
                    letterSpacing: 2,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    textShadow: "0 1px 2px rgba(0,0,0,0.08)",
                    marginTop: 32,
                  }}
                >
                  Project Timeline | ขั้นตอนการดำเนินงาน
                </div>
                <div
                  style={{
                    width: 180,
                    height: 3,
                    background: "#bbb",
                    borderRadius: 2,
                    margin: "0 auto 0 auto",
                  }}
                />
              </div>
            )}

            {/* Timeline Tasks - Grouped by Service Categories */}
            {selectedTasks && selectedTasks.length > 0 && workingTasks && (
              <TimelineTask
                workingTasks={workingTasks}
                selectedTasks={selectedTasks}
                tableCellStyle={tableCellStyle}
                tableHeaderStyle={tableHeaderStyle}
              />
            )}

            {/* Building Overview + Cost Summary (ล็อกให้อยู่หน้า 2 เท่านั้น) */}
            {rooms && rooms.length > 0 && (
              <BuildingOverview
                floorPlanImage={floorPlanImage}
                rooms={rooms}
                tableCellStyle={tableCellStyle}
                contentStyle={contentStyle}
                totalArea={totalArea}
                totalConstructionCost={totalConstructionCost}
                hasMultipleBuildings={hasMultipleBuildings}
                mibPercent={mibPercent}
                designFee={designFee}
                grandTotal={grandTotal}
              />
            )}

            {/* Footer */}
            <Footer contentStyle={contentStyle} />
          </div>

          {/* Export Button */}
          <ExportButton
            handleExportPDF={handleExportPDF}
            isLoading={isLoading}
            isCapturing={isCapturing}
            selectedTasks={selectedTasks}
            currentText={currentText}
          />
        </div>
      </div>
    </div>
  );
};

export default ExportPdf;
