import React from "react";

const HeaderTaskSelect = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-6">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10"></div>
      <div className="relative flex items-center space-x-3">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Select Tasks for Timeline Summary
          </h2>
          <p className="text-gray-300 text-sm font-light">
            เลือกงานเพื่อสรุประยะเวลา
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderTaskSelect;
