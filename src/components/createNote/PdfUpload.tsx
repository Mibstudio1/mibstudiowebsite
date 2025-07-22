// PdfUpload.tsx
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileText,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

interface PdfUploadProps {
  data: {
    pdfs: (File | { name: string; url: string; isExisting?: boolean })[];
    [key: string]: any;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ data, setData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (file.type === "application/pdf") {
      const alreadyAdded = data.pdfs.some((f: any) => f.name === file.name);
      if (!alreadyAdded) {
        setData((prev: any) => ({
          ...prev,
          pdfs: [...prev.pdfs, file],
        }));
      }
    } else {
      alert("กรุณาเลือกเฉพาะไฟล์ PDF");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(handleFile);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faFileText} className="w-5 h-5 text-gray-700 mr-3" />
        <div>
          <div>PDF Attachment</div>
          <div className="text-sm font-light opacity-80">ไฟล์แนบ PDF</div>
        </div>
      </h3>

      <div
        className={`border-2 border-dashed ${
          dragOver ? "border-gray-800 bg-gray-100" : "border-gray-300"
        } p-8 rounded-xl bg-white text-center text-gray-700 transition-all duration-300 cursor-pointer hover:border-gray-600 hover:bg-gray-50`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".pdf"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="space-y-3">
          <FontAwesomeIcon
            icon={faUpload}
            className="w-12 h-12 text-gray-400 mx-auto"
          />
          <p className="text-lg font-semibold text-gray-800">
            ลากและวางไฟล์ PDF ที่นี่
          </p>
          <p className="text-sm text-gray-600">หรือคลิกเพื่อเลือกไฟล์</p>
          <div className="inline-block bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faFileText} className="w-4 h-4" />
            เลือกไฟล์ PDF
          </div>
        </div>
      </div>

      {data.pdfs.filter((file: any) => !file.isExisting).length > 0 && (
        <div className="mt-6">
          <h4 className="text-base font-bold text-gray-800 mb-3">
            ไฟล์ที่เลือก (
            {data.pdfs.filter((file: any) => !file.isExisting).length} ไฟล์)
          </h4>
          <div className="space-y-2">
            {data.pdfs
              .filter((file: any) => !file.isExisting)
              .map((file: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FontAwesomeIcon
                      icon={faFileText}
                      className="w-5 h-5 text-red-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-800 font-medium truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {file.isExisting
                          ? "ไฟล์เดิม"
                          : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      </div>
                      {file.isExisting && file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ดูไฟล์
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setData((prev: any) => ({
                        ...prev,
                        pdfs: prev.pdfs.filter(
                          (_: any, i: number) => i !== index
                        ),
                      }));
                    }}
                    title="ลบไฟล์"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    <span className="text-sm font-medium">ลบ</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
