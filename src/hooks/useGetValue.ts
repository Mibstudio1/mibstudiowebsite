import { UseGetValueProps } from "@/interfaces/timeline";
import { GET, GET_PDF_FILE } from "@/services/route";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface pdfData {
  groupFile: string;
  url: string[];
}

export const useGetValue = ({
  pdfForm,
  selectedTasks,
  setIsLoading,
  workingTasks,
  buildingCostData,
}: UseGetValueProps) => {
  const [pdfData, setPdfData] = useState<pdfData[]>([]);
  useEffect(() => {
    fetchPDFFile();
  }, []);
  const exportPDF = async () => {
    if (
      !pdfForm.name ||
      !pdfForm.client ||
      !pdfForm.documentDate ||
      selectedTasks.length === 0
    ) {
      alert("กรุณากรอกข้อมูลและเลือกงานที่ต้องการสรุป");
      return;
    }

    setIsLoading(true);

    try {
      const selectedTasksData = workingTasks.filter((task) =>
        selectedTasks.includes(task.id)
      );

      // Get the content of the hidden PDF div
      const pdfContent = document.getElementById("pdf-content");
      if (!pdfContent) {
        throw new Error("PDF content element not found");
      }

      const response = await fetch(`${API_BASE_URL}/api/export-pdf-direct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectData: pdfForm,
          selectedTasks: selectedTasksData,
          buildingCostData: buildingCostData,
          htmlContent: pdfContent.innerHTML,
          companyInfo: {
            name: "MIB Studio",
            address: "107/65 ม.1 ต.มะเร็ต อ.เกาะสมุย จ.สุราษฏร์ธานี 84310",
            phone: "0947495654",
            logo: "/MIB final-03.png",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `MIB_Project_${pdfForm.name}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("ดาวน์โหลด PDF สำเร็จ!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPDFFile = async () => {
    try {
      const response: { success: boolean; data: any } = await GET(GET_PDF_FILE);
      if (!response.success) {
        return null;
      }
      setPdfData(response.data);
    } catch (error) {
      console.error("Error fetching service options:", error);
    }
  };

  return {
    exportPDF,
    pdfData,
    setPdfData,
  };
};
