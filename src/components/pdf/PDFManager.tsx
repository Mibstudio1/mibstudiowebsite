import React, { useState, useEffect } from "react";
import { PDFFile, PDFGroup, uploadPDF, getPDFs, deletePDF, downloadPDF } from "@/services/pdfService";

const PDFManager: React.FC = () => {
  const [pdfGroups, setPdfGroups] = useState<PDFGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("service");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load PDFs on component mount
  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      setLoading(true);
      const result = await getPDFs();
      if (result.success && result.data) {
        setPdfGroups(result.data);
      } else {
        console.error("Failed to load PDFs:", result.error);
      }
    } catch (error) {
      console.error("Error loading PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("กรุณาเลือกไฟล์ PDF เท่านั้น");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("กรุณาเลือกไฟล์ก่อน");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadPDF(selectedFile, selectedGroup);
      
      if (result.success) {
        alert("อัปโหลดไฟล์สำเร็จ");
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("pdf-file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        // Reload PDFs
        await loadPDFs();
      } else {
        alert(`อัปโหลดไฟล์ไม่สำเร็จ: ${result.error}`);
      }
    } catch (error) {
      alert(`เกิดข้อผิดพลาด: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (pdf: PDFFile) => {
    if (!confirm(`คุณต้องการลบไฟล์ "${pdf.name}" หรือไม่?`)) {
      return;
    }

    try {
      const result = await deletePDF(pdf.id);
      if (result.success) {
        alert("ลบไฟล์สำเร็จ");
        await loadPDFs();
      } else {
        alert(`ลบไฟล์ไม่สำเร็จ: ${result.error}`);
      }
    } catch (error) {
      alert(`เกิดข้อผิดพลาด: ${error}`);
    }
  };

  const handleDownload = async (pdf: PDFFile) => {
    try {
      await downloadPDF(pdf.id, pdf.name);
    } catch (error) {
      alert(`ดาวน์โหลดไฟล์ไม่สำเร็จ: ${error}`);
    }
  };

  const getGroupLabel = (groupFile: string) => {
    const labels: Record<string, string> = {
      service: "ข้อมูลบริษัท",
      work: "เงื่อนไขการจ้างงาน", 
      cert: "ตัวอย่างผลงาน",
    };
    return labels[groupFile] || groupFile;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">จัดการไฟล์ PDF</h2>
        
        {/* Upload Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">อัปโหลดไฟล์ใหม่</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลือกหมวดหมู่
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="service">ข้อมูลบริษัท</option>
                <option value="work">เงื่อนไขการจ้างงาน</option>
                <option value="cert">ตัวอย่างผลงาน</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลือกไฟล์ PDF
              </label>
              <input
                id="pdf-file-input"
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
              </button>
            </div>
          </div>
          
          {selectedFile && (
            <div className="text-sm text-gray-600">
              ไฟล์ที่เลือก: {selectedFile.name}
            </div>
          )}
        </div>

        {/* PDF List */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">ไฟล์ PDF ที่อัปโหลดแล้ว</h3>
          
          {pdfGroups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ไม่มีไฟล์ PDF ที่อัปโหลดแล้ว
            </div>
          ) : (
            <div className="space-y-4">
              {pdfGroups.map((group) => (
                <div key={group.groupFile} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold mb-3 text-gray-800">
                    {getGroupLabel(group.groupFile)}
                  </h4>
                  
                  <div className="space-y-2">
                    {group.files.map((pdf) => (
                      <div
                        key={pdf.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900">{pdf.name}</div>
                            <div className="text-sm text-gray-500">
                              อัปโหลดเมื่อ: {new Date(pdf.uploadDate).toLocaleDateString('th-TH')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownload(pdf)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            ดาวน์โหลด
                          </button>
                          <button
                            onClick={() => handleDelete(pdf)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFManager; 