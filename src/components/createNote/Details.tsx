import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faListUl } from "@fortawesome/free-solid-svg-icons";

const Details = ({
  data,
  setData,
}: {
  data: { details: { name: string; description: string }[] };
  setData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const addSubTopic = () => {
    setData({
      ...data,
      details: [...data.details, { name: "", description: "" }],
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3 mb-6 justify-between md:justify-start">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FontAwesomeIcon
            icon={faListUl}
            className="w-5 h-5 text-gray-700 mr-3"
          />
          <div className="flex flex-col">
            <div>Meeting Details</div>
            <div className="text-sm font-light opacity-80">
              รายละเอียดการประชุม
            </div>
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
        {data.details.map((t, index) => (
          <div key={index} className="md:p-5 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm md:text-base font-bold text-gray-800 flex">
                  Subtopic (หัวข้อย่อย) {index + 1}
                  {!t.name && <span className="text-red-500 ml-1">*</span>}
                </label>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        details: data.details.filter((_, i) => i !== index),
                      })
                    }
                    className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="กรอกหัวข้อย่อย..."
                className="w-full text-sm md:text-base border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
                value={t.name ?? ""}
                onChange={(e) => {
                  const newTopics = [...data.details];
                  newTopics[index].name = e.target.value;
                  setData({ ...data, details: newTopics });
                }}
              />

              <div className="flex justify-between items-center mb-2">
                <label className="text-sm md:text-base font-bold text-gray-800 flex">
                  Detail (รายละเอียด) {index + 1}{" "}
                  {!t.description && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <span className="text-sm text-gray-500">
                  {t.description?.length || 0}/400
                </span>
              </div>
              <textarea
                placeholder="กรอกรายละเอียด..."
                className="w-full text-sm md:text-base border-2 border-gray-200 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
                value={t.description ?? ""}
                maxLength={400}
                onChange={(e) => {
                  const newTopics = [...data.details];
                  newTopics[index].description = e.target.value;
                  setData({ ...data, details: newTopics });
                }}
              ></textarea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
