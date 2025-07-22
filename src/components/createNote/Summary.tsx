import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

type SummaryProps = {
  data: {
    details: { name: string; description: string }[];
    summaries: { topic: string; conclude: string }[];
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
};

const Summary = ({ data, setData }: SummaryProps) => {
  const addSubTopic = () => {
    setData({
      ...data,
      summaries: [...data.summaries, { topic: "", conclude: "" }],
    });
  };
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3 mb-6 justify-between md:justify-start">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="w-5 h-5 text-gray-700 mr-3"
          />
          <div>
            <div>Summarize</div>
            <div className="text-sm font-light opacity-80">สรุป</div>
          </div>
        </h3>
        <button
          type="button"
          onClick={addSubTopic}
          className="text-white bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {data.summaries.map((item, index) => (
          <div key={index} className=" md:p-5 rounded-lg border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm md:text-base font-bold text-gray-800 flex">
                  Subtopic (หัวข้อย่อย)
                  {!item.topic && <span className="text-red-500 ml-1">*</span>}
                </label>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = data.summaries.filter(
                        (_, i) => i !== index
                      );
                      setData({ ...data, summaries: updated });
                    }}
                    className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                  </button>
                )}
              </div>
              <select
                className="w-full text-sm md:text-base border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-white transition-all duration-300"
                value={item.topic || ""}
                onChange={(e) => {
                  const newSummaries = [...data.summaries];
                  newSummaries[index].topic = e.target.value;
                  setData({ ...data, summaries: newSummaries });
                }}
              >
                <option value="" className="text-gray-500">
                  Select Subtopic (เลือกหัวข้อ)
                </option>
                {data.details
                  .filter((detail) => detail.name)
                  .filter((detail) => {
                    return !data.summaries.some(
                      (summary, i) =>
                        i !== index && summary.topic === detail.name
                    );
                  })
                  .map((detail, i) => (
                    <option
                      key={i}
                      value={detail.name}
                      className="text-gray-900"
                    >
                      {detail.name}
                    </option>
                  ))}
              </select>

              <div className="flex justify-between items-center mb-2">
                <label className="text-sm md:text-base font-bold text-gray-800 flex">
                  Conclusion (ข้อสรุป)
                  {!item.conclude && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <span className="text-sm text-gray-500">
                  {item.conclude?.length || 0}/400
                </span>
              </div>
              <textarea
                placeholder="กรอกข้อสรุป..."
                className="w-full text-sm md:text-base border-2 border-gray-200 rounded-xl px-4 py-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
                value={item.conclude ?? ""}
                maxLength={400}
                onChange={(e) => {
                  const updated = [...data.summaries];
                  updated[index].conclude = e.target.value;
                  setData({ ...data, summaries: updated });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
