import React from "react";

const BuildingCostHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 sm:px-8 py-6">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10"></div>
      <div className="relative flex items-center space-x-3">
        
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Building Cost Estimator
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm font-light">
            เครื่องมือประมาณราคาอาคาร
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuildingCostHeader;
