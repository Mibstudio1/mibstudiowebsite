import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileText, faCalendar } from "@fortawesome/free-solid-svg-icons";

const TopicData = ({
  data,
  setData,
}: {
  data: { project: string; title: string; date: string };
  setData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";

    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 overflow-hidden">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FontAwesomeIcon
          icon={faFileText}
          className="w-5 h-5 text-gray-700 mr-3"
        />
        <div className="flex flex-col">
          <div>Infomation</div>
          <div className="text-sm font-light opacity-80">ข้อมูลพื้นฐาน</div>
        </div>
      </h3>
      <div className="mb-4">
        <label className="block text-sm md:text-base mb-2 font-semibold text-gray-800">
          Project (ชื่อโปรเจค)
          {!data.project && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="text"
          placeholder="กรอกชื่อโครงการ..."
          className="w-full text-sm md:text-base border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
          value={data.project}
          onChange={(e) => setData({ ...data, project: e.target.value })}
          required
        />
      </div>
      <div className="md:grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm md:text-base mb-2 font-semibold text-gray-800">
            Title (หัวข้อ)
            {!data.title && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            placeholder="กรอกหัวข้อการประชุม..."
            className="w-full text-sm md:text-base border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm md:text-base mb-2 font-semibold text-gray-800 flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCalendar}
              className="w-4 h-4 text-gray-600"
            />
            Meeting Date(วันที่ประชุม)
            {!data.date && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="date"
            className="w-full text-sm md:text-base border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-white transition-all duration-300"
            value={formatDateForInput(data.date)}
            onChange={(e) => setData({ ...data, date: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default TopicData;
