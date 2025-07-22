import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import jsPDF from "jspdf";
import ExportPdf2 from "./ExportPdf2";
import ReactDOMServer from "react-dom/server";
import SectionTitlePage from "./SectionTitlePage";
import { uploadPDF, getPDFs, deletePDF, PDFFile, PDFGroup } from "@/services/pdfService";

const initialProposals = [""];

const A4_WIDTH = 595.28; // points
const A4_HEIGHT = 841.89; // points

// Section definitions
const SECTIONS = [
  {
    key: "service",
    label: "ส่วนที่ 1: ข้อมูลบริษัท",
    title: "Service Selection & File Upload | ข้อมูลบริษัท",
    fileState: "serviceFiles",
  },
  {
    key: "work",
    label: "ส่วนที่ 2: เงื่อนไขการจ้างงาน",
    title: "Work Credits | เงื่อนไขการจ้างงาน",
    fileState: "creditFiles",
  },
  {
    key: "cert",
    label: "ส่วนที่ 3: ตัวอย่างผลงาน",
    title: "Certificates & Related Documents | ตัวอย่างผลงาน",
    fileState: "certFiles",
  },
];

const DocumentManager = () => {
  // Proposal section
  const [proposals, setProposals] = useState(initialProposals);
  // Special Requests
  const [specialRequests, setSpecialRequests] = useState("");
  // Additional Agreements
  const [additionalAgreements, setAdditionalAgreements] = useState("");
  // Service section (รวมไฟล์เดียว ไม่แยก checkbox)
  const [serviceFiles, setServiceFiles] = useState<File[]>([]);
  // Work Credits
  const [creditFiles, setCreditFiles] = useState<File[]>([]);
  // Certificates
  const [certFiles, setCertFiles] = useState<File[]>([]);
  // เพิ่ม state สำหรับ section selection
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>({
    service: false,
    work: false,
    cert: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  // เพิ่ม state สำหรับไฟล์ที่อัปโหลดแล้วจากฐานข้อมูล
  const [uploadedPDFs, setUploadedPDFs] = useState<PDFGroup[]>([]);
  const [uploadingFile, setUploadingFile] = useState<{ file: File, group: string, index: number } | null>(null);

  // เพิ่ม state สำหรับการเลือกไฟล์ที่อัปโหลดแล้ว
  const [selectedUploadedPDFs, setSelectedUploadedPDFs] = useState<Set<number>>(new Set());

  // Load uploaded PDFs on component mount
  useEffect(() => {
    loadUploadedPDFs();
  }, []);

  const loadUploadedPDFs = async () => {
    try {
      const result = await getPDFs();
      if (result.success && result.data) {
        setUploadedPDFs(result.data);
      }
    } catch (error) {
      console.error("Error loading uploaded PDFs:", error);
    }
  };

  // Upload file to database
  const handleUploadToDB = async (file: File, group: string, index: number) => {
    try {
      setUploadingFile({ file, group, index });
      const result = await uploadPDF(file, group);

      if (result.success) {
        // Remove file from local state after successful upload
        const setter = group === "service" ? setServiceFiles :
          group === "work" ? setCreditFiles : setCertFiles;
        setter(prev => prev.filter((_, i) => i !== index));

        // Reload uploaded PDFs
        await loadUploadedPDFs();
        alert("อัปโหลดไฟล์สำเร็จ");
      } else {
        alert(`อัปโหลดไฟล์ไม่สำเร็จ: ${result.error}`);
      }
    } catch (error) {
      alert(`เกิดข้อผิดพลาด: ${error}`);
    } finally {
      setUploadingFile(null);
    }
  };

  // Delete uploaded PDF
  const handleDeleteUploadedPDF = async (pdf: PDFFile) => {
    if (!confirm(`คุณต้องการลบไฟล์ "${pdf.name}" หรือไม่?`)) {
      return;
    }

    try {
      const result = await deletePDF(pdf.id);
      if (result.success) {
        await loadUploadedPDFs();
        alert("ลบไฟล์สำเร็จ");
      } else {
        alert(`ลบไฟล์ไม่สำเร็จ: ${result.error}`);
      }
    } catch (error) {
      alert(`เกิดข้อผิดพลาด: ${error}`);
    }
  };



  // Toggle selection of uploaded PDF
  const toggleUploadedPDFSelection = (pdfId: number) => {
    setSelectedUploadedPDFs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pdfId)) {
        newSet.delete(pdfId);
        console.log(`Deselected PDF ID: ${pdfId}`);
      } else {
        newSet.add(pdfId);
        console.log(`Selected PDF ID: ${pdfId}`);
      }
      console.log(`Current selected PDFs:`, Array.from(newSet));
      return newSet;
    });
  };

  // Select all uploaded PDFs in a group
  const selectAllInGroup = (groupFile: string) => {
    const groupPDFs = uploadedPDFs.find(g => g.groupFile === groupFile)?.files || [];
    const pdfIds = groupPDFs.map(pdf => pdf.id);
    setSelectedUploadedPDFs(prev => new Set([...prev, ...pdfIds]));
  };

  // Deselect all uploaded PDFs in a group
  const deselectAllInGroup = (groupFile: string) => {
    const groupPDFs = uploadedPDFs.find(g => g.groupFile === groupFile)?.files || [];
    const pdfIds = groupPDFs.map(pdf => pdf.id);
    setSelectedUploadedPDFs(prev => {
      const newSet = new Set(prev);
      pdfIds.forEach(id => newSet.delete(id));
      return newSet;
    });
  };

  // Proposal handlers
  const handleProposalChange = (value: string) => {
    setProposals(value.split("\n"));
  };

  // File handlers (with preview & remove)
  const handleFile = (setter: React.Dispatch<React.SetStateAction<File[]>>) => (files: FileList | null) => {
    if (files) setter(prev => [...prev, ...Array.from(files)]);
  };
  const removeFile = (setter: React.Dispatch<React.SetStateAction<File[]>>, idx: number) => {
    setter(prev => prev.filter((_, i) => i !== idx));
  };

  // Drag & drop
  const handleDrop = (setter: React.Dispatch<React.SetStateAction<File[]>>, e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setter(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  // สร้าง Proposal Form PDF ด้วย jsPDF (รองรับภาษาไทย)
  const createProposalPdf = async (proposals: string[]) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFont("THSarabunNew", "normal");
    doc.setFontSize(22);
    doc.text("Proposal / ข้อเสนอ", 50, 60);
    doc.setFontSize(16);
    let y = 100;
    proposals.forEach((p, i) => {
      if (p.trim() !== "") {
        doc.text(`${i + 1}. ${p}`, 60, y);
        y += 28;
      }
    });
    return doc.output("arraybuffer");
  };

  // Merge PDF files and download (A4 size for all pages)
  const handleExportPDF = async () => {
    setIsExporting(true);
    const allFiles: File[] = [
      ...serviceFiles,
      ...creditFiles,
      ...certFiles
    ];
    if (allFiles.length === 0 && proposals.every(p => p.trim() === "")) {
      alert("Please upload at least one PDF file or fill in a proposal.\nกรุณาอัปโหลดไฟล์ PDF หรือกรอกข้อเสนออย่างน้อย 1 ข้อ");
      setIsExporting(false);
      return;
    }
    try {
      const mergedPdf = await PDFDocument.create();
      // ถ้ามีข้อเสนอ สร้าง Proposal Form PDF ด้วย jsPDF แล้ว merge
      if (proposals.some(p => p.trim() !== "")) {
        const proposalPdfBytes = await createProposalPdf(proposals);
        const proposalPdf = await PDFDocument.load(proposalPdfBytes);
        const copiedPages = await mergedPdf.copyPages(proposalPdf, proposalPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      for (const file of allFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        for (const page of pdf.getPages()) {
          const [embedPage] = await mergedPdf.embedPages([page]);
          const { width: w, height: h } = page.getSize();
          const scale = Math.min(A4_WIDTH / w, A4_HEIGHT / h, 1);
          const x = (A4_WIDTH - w * scale) / 2;
          const y = (A4_HEIGHT - h * scale) / 2;
          const newPage = mergedPdf.addPage([A4_WIDTH, A4_HEIGHT]);
          newPage.drawPage(embedPage, { x, y, xScale: scale, yScale: scale });
        }
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged_document.pdf";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      alert("Error merging PDF files.\nเกิดข้อผิดพลาดในการรวมไฟล์ PDF");
    }
    setIsExporting(false);
  };

  // ฟังก์ชัน export PDF แบบใหม่ (ExportPdf2)
  const handleExportPDF2 = async () => {
    setIsExporting(true);
    try {
      // ตรวจสอบว่ามีข้อเสนอหรือไม่ (หน้าแรกจะแสดงทุกครั้ง)
      const hasProposals = proposals.some(p => p.trim() !== "");

      // ตรวจสอบว่ามี section ที่เลือกและมีไฟล์ใน section นั้นหรือไม่
      const hasSelectedSectionsWithFiles = SECTIONS.some(section => {
        if (!selectedSections[section.key]) {
          console.log(`Section ${section.key} not selected`);
          return false;
        }

        const hasLocalFiles = section.key === "service" ? serviceFiles.length > 0 :
          section.key === "work" ? creditFiles.length > 0 :
            section.key === "cert" ? certFiles.length > 0 : false;

        const groupPDFs = uploadedPDFs.find(g => g.groupFile === section.key)?.files || [];
        const hasSelectedUploadedFiles = groupPDFs.some(pdf => selectedUploadedPDFs.has(pdf.id));

        console.log(`Section ${section.key}: local files=${hasLocalFiles}, uploaded files=${hasSelectedUploadedFiles}`);
        console.log(`Section ${section.key} groupPDFs:`, groupPDFs.map(pdf => ({ id: pdf.id, name: pdf.name, selected: selectedUploadedPDFs.has(pdf.id) })));
        return hasLocalFiles || hasSelectedUploadedFiles;
      });

      if (!hasProposals && !hasSelectedSectionsWithFiles) {
        alert("กรุณากรอกข้อเสนอ หรือเลือกส่วนที่มีไฟล์ PDF และติ๊ก 'รวมส่วนนี้ใน PDF'");
        setIsExporting(false);
        return;
      }

      // เตรียมข้อมูลความเห็นลูกค้า
      const customerComments = {
        proposal: proposals.filter(p => p.trim() !== "").join("\n"),
        specialRequest: specialRequests,
        additionalAgreement: additionalAgreements,
      };

      // render HTML
      const htmlContent = ReactDOMServer.renderToString(
        <ExportPdf2 customerComments={customerComments} />
      );

      // ส่งไปยัง API export-pdf-direct เพื่อสร้างหน้าแรกเป็น PDF blob
      const response = await fetch("/api/export-pdf-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent }),
      });
      if (!response.ok) throw new Error("Failed to generate PDF");
      const proposalBlob = await response.blob();
      const proposalArrayBuffer = await proposalBlob.arrayBuffer();

      // เตรียมไฟล์ PDF อื่นๆ
      const mergedPdf = await PDFDocument.create();

      // Merge หน้า proposal (แสดงทุกครั้ง)
      const proposalPdf = await PDFDocument.load(proposalArrayBuffer);
      const copiedPages = await mergedPdf.copyPages(proposalPdf, proposalPdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));

      // รวม Section ตามที่เลือก
      for (const section of SECTIONS) {
        if (!selectedSections[section.key]) {
          console.log(`Section ${section.key} not selected, skipping`);
          continue;
        }

        console.log(`Processing section: ${section.key}`);

        // Section Title Page (React/HTML/CSS)
        const htmlContent = ReactDOMServer.renderToString(
          <SectionTitlePage title={section.title} />
        );
        const response = await fetch("/api/export-pdf-direct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ htmlContent }),
        });
        if (!response.ok) throw new Error("Failed to generate section title PDF");
        const sectionTitleBlob = await response.blob();
        const sectionTitleArrayBuffer = await sectionTitleBlob.arrayBuffer();
        const sectionTitlePdf = await PDFDocument.load(sectionTitleArrayBuffer);
        const sectionTitlePages = await mergedPdf.copyPages(sectionTitlePdf, sectionTitlePdf.getPageIndices());
        sectionTitlePages.forEach((page) => mergedPdf.addPage(page));

        // Merge local files in section
        const localFiles =
          section.key === "service"
            ? serviceFiles
            : section.key === "work"
              ? creditFiles
              : section.key === "cert"
                ? certFiles
                : [];

        for (const file of localFiles) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          for (const page of pdf.getPages()) {
            const [embedPage] = await mergedPdf.embedPages([page]);
            const { width: w, height: h } = page.getSize();
            const scale = Math.min(A4_WIDTH / w, A4_HEIGHT / h, 1);
            const x = (A4_WIDTH - w * scale) / 2;
            const y = (A4_HEIGHT - h * scale) / 2;
            const newPage = mergedPdf.addPage([A4_WIDTH, A4_HEIGHT]);
            newPage.drawPage(embedPage, { x, y, xScale: scale, yScale: scale });
          }
        }

        // Merge selected uploaded files in section
        const groupPDFs = uploadedPDFs.find(g => g.groupFile === section.key)?.files || [];
        const selectedGroupPDFs = groupPDFs.filter(pdf => selectedUploadedPDFs.has(pdf.id));

        console.log(`Section ${section.key}: ${localFiles.length} local files, ${selectedGroupPDFs.length} selected uploaded files`);
        console.log(`Selected PDF IDs in section ${section.key}:`, selectedGroupPDFs.map(pdf => pdf.id));

        for (const pdf of selectedGroupPDFs) {
          try {
            console.log(`Downloading PDF: ${pdf.name} (ID: ${pdf.id})`);
            const response = await fetch(`/api/pdf/download?id=${pdf.id}`);
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Failed to download PDF ${pdf.name}:`, response.status, errorText);
              throw new Error(`Failed to download PDF ${pdf.name}: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            console.log(`Downloaded PDF ${pdf.name}: ${arrayBuffer.byteLength} bytes`);

            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();
            console.log(`PDF ${pdf.name} has ${pageCount} pages`);

            for (const page of pdfDoc.getPages()) {
              const [embedPage] = await mergedPdf.embedPages([page]);
              const { width: w, height: h } = page.getSize();
              const scale = Math.min(A4_WIDTH / w, A4_HEIGHT / h, 1);
              const x = (A4_WIDTH - w * scale) / 2;
              const y = (A4_HEIGHT - h * scale) / 2;
              const newPage = mergedPdf.addPage([A4_WIDTH, A4_HEIGHT]);
              newPage.drawPage(embedPage, { x, y, xScale: scale, yScale: scale });
            }
            console.log(`Successfully processed PDF: ${pdf.name}`);
          } catch (error) {
            console.error(`Error processing uploaded PDF ${pdf.name}:`, error);
          }
        }
      }

      const pdfBytes = await mergedPdf.save();
      const url = window.URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Merged_Proposal_and_Documents_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการ export PDF รวบรวมหน้า proposal และไฟล์เอกสาร");
    }
    setIsExporting(false);
  };

  // PDF icon SVG
  const PdfIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#F87171" /><path d="M7.5 7.5h5v5h-5v-5z" fill="#fff" /><path d="M7.5 7.5h5v5h-5v-5z" stroke="#fff" strokeWidth="1.2" /></svg>
  );

  // File preview component with upload button and selection
  const FilePreview = ({
    files,
    onRemove,
    group,
    onUploadToDB,
    uploadedPDFs,
    onDeleteUploaded,
    selectedUploadedPDFs,
    onToggleSelection,
    onSelectAllInGroup,
    onDeselectAllInGroup
  }: {
    files: File[],
    onRemove: (idx: number) => void,
    group: string,
    onUploadToDB: (file: File, group: string, index: number) => void,
    uploadedPDFs: PDFGroup[],
    onDeleteUploaded: (pdf: PDFFile) => void,
    selectedUploadedPDFs: Set<number>,
    onToggleSelection: (pdfId: number) => void,
    onSelectAllInGroup: (groupFile: string) => void,
    onDeselectAllInGroup: (groupFile: string) => void
  }) => {
    const groupPDFs = uploadedPDFs.find(g => g.groupFile === group)?.files || [];
    const selectedInGroup = groupPDFs.filter(pdf => selectedUploadedPDFs.has(pdf.id));
    const allSelectedInGroup = groupPDFs.length > 0 && selectedInGroup.length === groupPDFs.length;

    return (
      <div className="space-y-3 mt-2">
        {/* Local files */}
        {files.map((f, idx) => (
          <div key={`local-${idx}`} className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <PdfIcon />
              <span className="text-sm text-gray-800 max-w-[160px] truncate" title={f.name}>{f.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => onUploadToDB(f, group, idx)}
                disabled={uploadingFile?.file === f && uploadingFile?.group === group && uploadingFile?.index === idx}
                title="อัปโหลดขึ้นฐานข้อมูล"
              >
                {uploadingFile?.file === f && uploadingFile?.group === group && uploadingFile?.index === idx
                  ? "กำลังอัปโหลด..."
                  : "อัปโหลด"}
              </button>
              <button
                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => onRemove(idx)}
                title="ลบไฟล์"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}

        {/* Uploaded files from database */}
        {groupPDFs.length > 0 && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">ไฟล์ที่อัปโหลดแล้ว</span>
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => allSelectedInGroup ? onDeselectAllInGroup(group) : onSelectAllInGroup(group)}
                >
                  {allSelectedInGroup ? "ยกเลิกเลือกทั้งหมด" : "เลือกทั้งหมด"}
                </button>
              </div>
            </div>

            {groupPDFs.map((pdf) => (
              <div key={`uploaded-${pdf.id}`} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUploadedPDFs.has(pdf.id)}
                    onChange={() => onToggleSelection(pdf.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <PdfIcon />
                  <div>
                    <span className="text-sm text-gray-800 max-w-[160px] truncate block" title={pdf.name}>
                      {pdf.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      อัปโหลดเมื่อ: {new Date(pdf.uploadDate).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => onDeleteUploaded(pdf)}
                    title="ลบจากฐานข้อมูล"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="group">
      <div className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 sm:px-8 lg:px-10 pt-6 sm:pt-7 pb-4 sm:pb-5">
          <h1 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight mb-1 text-left">Document Management Tool</h1>
          <div className="text-gray-300 text-sm font-normal text-left">เครื่องมือจัดการเอกสาร</div>
        </div>
        <div className="p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Proposal Section */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-bold mb-4 text-black text-left">Proposal for Client <span className="font-normal text-gray-500">(ข้อเสนอสำหรับลูกค้า)</span></h2>
            <div className="space-y-2">
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white focus:ring-2 focus:ring-black/30 focus:border-black/40 transition placeholder-gray-400 text-sm shadow-sm resize-none"
                placeholder="Enter proposal details here / ใส่รายละเอียดข้อเสนอที่นี่ (สูงสุด 400 ตัวอักษร)"
                value={proposals.join("\n")}
                onChange={e => {
                  const text = e.target.value;
                  if (text.length <= 400) {
                    setProposals(text.split("\n"));
                  }
                }}
                rows={6}
                maxLength={400}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {proposals.join("\n").length}/400 ตัวอักษร
              </div>
            </div>
          </section>

          {/* Special Requests Section */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow p-5">
            <h2 className="text-lg font-bold mb-4 text-black text-left">Special Requests <span className="font-normal text-gray-500">(ความต้องการพิเศษของลูกค้า)</span></h2>
            <div className="space-y-2">
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white focus:ring-2 focus:ring-black/30 focus:border-black/40 transition placeholder-gray-400 text-sm shadow-sm resize-none"
                placeholder="Enter special requests here / ใส่ความต้องการพิเศษที่นี่ (สูงสุด 400 ตัวอักษร)"
                value={specialRequests}
                onChange={e => {
                  if (e.target.value.length <= 400) {
                    setSpecialRequests(e.target.value);
                  }
                }}
                rows={4}
                maxLength={400}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {specialRequests.length}/400 ตัวอักษร
              </div>
            </div>
          </section>

          {/* Additional Agreements Section */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow p-5">
            <h2 className="text-lg font-bold mb-4 text-black text-left">Additional Agreements <span className="font-normal text-gray-500">(ข้อตกลงเพิ่มเติม)</span></h2>
            <div className="space-y-2">
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white focus:ring-2 focus:ring-black/30 focus:border-black/40 transition placeholder-gray-400 text-sm shadow-sm resize-none"
                placeholder="Enter additional agreements here / ใส่ข้อตกลงเพิ่มเติมที่นี่ (สูงสุด 400 ตัวอักษร)"
                value={additionalAgreements}
                onChange={e => {
                  if (e.target.value.length <= 400) {
                    setAdditionalAgreements(e.target.value);
                  }
                }}
                rows={4}
                maxLength={400}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {additionalAgreements.length}/400 ตัวอักษร
              </div>
            </div>
          </section>
          {/* Section Selection Checkbox */}
          {/* ลบ block Section Selection Checkbox ที่รวมไว้ด้านบนออก */}
          {/* Service Section */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow p-5">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedSections.service}
                onChange={e => {
                  setSelectedSections(s => ({ ...s, service: e.target.checked }));
                  console.log(`Service section selected: ${e.target.checked}`);
                }}
              />
              <span className="font-semibold text-base" style={{ color: '#111', fontWeight: 600 }}>รวมส่วนนี้ใน PDF</span>
            </div>
            <h2 className="text-lg font-bold mb-4 text-black text-left">Service Selection & File Upload <span className="font-normal text-gray-500">(เลือกบริการและอัปโหลดไฟล์รายละเอียด)</span></h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-white hover:bg-gray-100 transition"
              onDrop={e => handleDrop(setServiceFiles, e)}
              onDragOver={e => e.preventDefault()}
            >
              <span className="block text-gray-700 font-medium mb-1 text-sm">Drag & drop PDF files here <span className="text-gray-400">(ลากและวางไฟล์ PDF ที่นี่)</span></span>
              <label className="underline text-blue-700 cursor-pointer font-semibold text-sm">
                Select PDF files (เลือกไฟล์ PDF)
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={e => handleFile(setServiceFiles)(e.target.files)}
                />
              </label>
              <FilePreview
                files={serviceFiles}
                onRemove={idx => removeFile(setServiceFiles, idx)}
                group="service"
                onUploadToDB={handleUploadToDB}
                uploadedPDFs={uploadedPDFs}
                onDeleteUploaded={handleDeleteUploadedPDF}
                selectedUploadedPDFs={selectedUploadedPDFs}
                onToggleSelection={toggleUploadedPDFSelection}
                onSelectAllInGroup={selectAllInGroup}
                onDeselectAllInGroup={deselectAllInGroup}
              />
            </div>
          </section>
          {/* Work Credits Section */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow p-5">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedSections.work}
                onChange={e => {
                  setSelectedSections(s => ({ ...s, work: e.target.checked }));
                  console.log(`Work section selected: ${e.target.checked}`);
                }}
              />
              <span className="font-semibold text-base" style={{ color: '#111', fontWeight: 600 }}>รวมส่วนนี้ใน PDF</span>
            </div>
            <h2 className="text-lg font-bold mb-4 text-black text-left">Work Credits <span className="font-normal text-gray-500">(เครดิตงาน)</span></h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-white hover:bg-gray-100 transition"
              onDrop={e => handleDrop(setCreditFiles, e)}
              onDragOver={e => e.preventDefault()}
            >
              <span className="block text-gray-700 font-medium mb-1 text-sm">Drag & drop PDF files here <span className="text-gray-400">(ลากและวางไฟล์ PDF ที่นี่)</span></span>
              <label className="underline text-blue-700 cursor-pointer font-semibold text-sm">
                Select PDF files (เลือกไฟล์ PDF เครดิตงาน)
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={e => handleFile(setCreditFiles)(e.target.files)}
                />
              </label>
              <FilePreview
                files={creditFiles}
                onRemove={idx => removeFile(setCreditFiles, idx)}
                group="work"
                onUploadToDB={handleUploadToDB}
                uploadedPDFs={uploadedPDFs}
                onDeleteUploaded={handleDeleteUploadedPDF}
                selectedUploadedPDFs={selectedUploadedPDFs}
                onToggleSelection={toggleUploadedPDFSelection}
                onSelectAllInGroup={selectAllInGroup}
                onDeselectAllInGroup={deselectAllInGroup}
              />
            </div>
          </section>
          {/* Certificates Section */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow p-5">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedSections.cert}
                onChange={e => {
                  setSelectedSections(s => ({ ...s, cert: e.target.checked }));
                  console.log(`Cert section selected: ${e.target.checked}`);
                }}
              />
              <span className="font-semibold text-base" style={{ color: '#111', fontWeight: 600 }}>รวมส่วนนี้ใน PDF</span>
            </div>
            <h2 className="text-lg font-bold mb-4 text-black text-left">Certificates & Related Documents <span className="font-normal text-gray-500">(ใบรับรอง และส่วนงานที่เกี่ยวข้อง)</span></h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-white hover:bg-gray-100 transition"
              onDrop={e => handleDrop(setCertFiles, e)}
              onDragOver={e => e.preventDefault()}
            >
              <span className="block text-gray-700 font-medium mb-1 text-sm">Drag & drop PDF files here <span className="text-gray-400">(ลากและวางไฟล์ PDF ที่นี่)</span></span>
              <label className="underline text-blue-700 cursor-pointer font-semibold text-sm">
                Select PDF files (เลือกไฟล์ PDF ใบรับรอง)
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={e => handleFile(setCertFiles)(e.target.files)}
                />
              </label>
              <FilePreview
                files={certFiles}
                onRemove={idx => removeFile(setCertFiles, idx)}
                group="cert"
                onUploadToDB={handleUploadToDB}
                uploadedPDFs={uploadedPDFs}
                onDeleteUploaded={handleDeleteUploadedPDF}
                selectedUploadedPDFs={selectedUploadedPDFs}
                onToggleSelection={toggleUploadedPDFSelection}
                onSelectAllInGroup={selectAllInGroup}
                onDeselectAllInGroup={deselectAllInGroup}
              />
            </div>
          </section>
        </div>
        {/* Export PDF Button */}
        <div className="flex flex-col items-center gap-3 mt-10 mb-2">
          <button
            className="relative px-8 py-3 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-lg font-bold shadow-2xl hover:brightness-110 transition border border-black/80 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleExportPDF2}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export PDF (รวบรวมเอกสารเป็นไฟล์เดียว)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager; 