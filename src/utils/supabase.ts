import { createClient } from "@supabase/supabase-js";

const bucket_name = "file-attachment";
const bucket_name_timeline = "pdf-storage";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

const supabase = createClient(url, key);

// ฟังก์ชันสร้างชื่อไฟล์ที่ปลอดภัย
const generateSafeFileName = (originalName: string): string => {
  // แยกชื่อไฟล์และนามสกุล
  const lastDotIndex = originalName.lastIndexOf(".");
  const nameWithoutExt =
    lastDotIndex !== -1
      ? originalName.substring(0, lastDotIndex)
      : originalName;
  const extension =
    lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : "";

  // สร้างชื่อไฟล์ที่ปลอดภัย
  const safeName = nameWithoutExt
    .replace(/[^a-zA-Z0-9]/g, "_") // แทนที่อักขระพิเศษด้วย underscore
    .replace(/_+/g, "_") // รวม underscore ที่ติดกัน
    .replace(/^_|_$/g, "") // ลบ underscore ที่ต้นและท้าย
    .substring(0, 50); // จำกัดความยาว

  // สร้างชื่อไฟล์สุดท้าย
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);

  return `${safeName}_${timestamp}_${randomString}${extension}`;
};

// เปลี่ยน return ให้เป็น array ของ object ที่มี name และ url
export const uploadFiles = async (files: File[]) => {
  const results: { name: string; url: string }[] = [];

  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY environment variables."
    );
  }

  for (const file of files) {
    try {
      // สร้างชื่อไฟล์ที่ปลอดภัย
      const safeFileName = generateSafeFileName(file.name);

      const { data, error } = await supabase.storage
        .from(bucket_name)
        .upload(safeFileName, file);

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error(`Upload failed for ${file.name}: ${error.message}`);
      }

      const publicUrl = supabase.storage
        .from(bucket_name)
        .getPublicUrl(safeFileName).data.publicUrl;

      results.push({ name: file.name, url: publicUrl });
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw new Error(
        `Upload failed for ${file.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  return results;
};

// ฟังก์ชันลบไฟล์จาก Supabase storage
export const deleteFiles = async (fileNames: string[]) => {
  const results: { success: boolean; fileName: string; error?: string }[] = [];

  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY environment variables."
    );
  }

  for (const fileName of fileNames) {
    try {
      const { error } = await supabase.storage
        .from(bucket_name)
        .remove([fileName]);

      if (error) {
        console.error("Supabase delete error:", error);
        results.push({ success: false, fileName, error: error.message });
      } else {
        results.push({ success: true, fileName });
      }
    } catch (error) {
      console.error(`Error deleting file ${fileName}:`, error);
      results.push({
        success: false,
        fileName,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  return results;
};

export const uploadFile = async (file: File) => {
  const timeStamp = Date.now();
  const newName = `${file.name}-${timeStamp}`;
  const { data, error } = await supabase.storage
    .from(bucket_name_timeline)
    .upload(newName, file);
  if (!data) throw new Error("upload failed!!!");
  return supabase.storage.from(bucket_name_timeline).getPublicUrl(newName).data
    .publicUrl;
};
