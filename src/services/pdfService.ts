export interface PDFFile {
  id: number;
  name: string;
  groupFile: string;
  uploadDate: Date;
}

export interface PDFGroup {
  groupFile: string;
  files: PDFFile[];
}

export interface UploadResponse {
  success: boolean;
  data?: {
    id: number;
    name: string;
    groupFile: string;
    uploadDate: Date;
  };
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    name: string;
    groupFile: string;
  };
  error?: string;
}

// Upload PDF to database
export const uploadPDF = async (
  file: File,
  groupFile: string,
  fileName?: string
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupFile", groupFile);
    formData.append("fileName", fileName || file.name);

    const response = await fetch("/api/pdf/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Upload PDF error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Get all PDFs from database
export const getPDFs = async (): Promise<{
  success: boolean;
  data?: PDFGroup[];
  error?: string;
}> => {
  try {
    const response = await fetch("/api/pdf/upload", {
      method: "GET",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Get PDFs error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Delete PDF from database
export const deletePDF = async (id: number): Promise<DeleteResponse> => {
  try {
    const response = await fetch(`/api/pdf/delete?id=${id}`, {
      method: "DELETE",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Delete PDF error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Download PDF from database
export const downloadPDF = async (id: number, fileName?: string): Promise<void> => {
  try {
    const response = await fetch(`/api/pdf/download?id=${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to download PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || `pdf-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download PDF error:", error);
    throw error;
  }
}; 