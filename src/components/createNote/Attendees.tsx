import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUsers } from "@fortawesome/free-solid-svg-icons";

const Attendees = ({
  data,
  setData,
}: {
  data: { attendees: { role: string; name: string }[] };
  setData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const addParticipant = () => {
    setData({
      ...data,
      attendees: [...data.attendees, { role: "พนักงาน", name: "" }],
    });
  };
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3 mb-6 justify-between md:justify-start">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FontAwesomeIcon
            icon={faUsers}
            className="w-5 h-5 text-gray-700 mr-3"
          />
          <div className="flex flex-col ">
            <div>Attendees</div>
            <div className="text-sm font-light opacity-80">ผู้เข้าร่วม</div>
          </div>
        </h3>
        <button
          type="button"
          onClick={addParticipant}
          className="text-white bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
        >
          +
        </button>
      </div>
      <div className="space-y-4">
        {data?.attendees?.map((p, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-4 items-center rounded-lg"
          >
            <div className="items-center justify-between mb-4">
              <label className="flex text-sm md:text-base font-bold text-gray-800 mb-2">
                Role (ตำแหน่ง)
              </label>
              <select
                className="w-full text-sm md:text-base border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-white transition-all duration-300"
                value={p.role}
                onChange={(e) => {
                  const newParticipants = [...data.attendees];
                  newParticipants[index].role = e.target.value;
                  setData({ ...data, attendees: newParticipants });
                }}
              >
                <option value="พนักงาน">Employee (พนักงาน)</option>
                <option value="ลูกค้า">Customer (ลูกค้า)</option>
              </select>
            </div>
            <div className="items-center justify-between mb-4">
              <div className="flex justify-between">
                <label className="flex text-sm md:text-base font-bold text-gray-800 mb-2">
                  Name (ชื่อผู้เข้าร่วม)
                  {!p.name && <span className="text-red-500 ml-1">*</span>}
                </label>
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        attendees: data.attendees.filter((_, i) => i !== index),
                      })
                    }
                    className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-[20px] h-[20px] invisible"></div>
                )}
              </div>
              <input
                type="text"
                placeholder="กรอกชื่อผู้เข้าร่วม..."
                className="w-full text-sm md:text-base border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
                value={p.name}
                onChange={(e) => {
                  const newParticipants = [...data.attendees];
                  newParticipants[index].name = e.target.value;
                  setData({ ...data, attendees: newParticipants });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attendees;
