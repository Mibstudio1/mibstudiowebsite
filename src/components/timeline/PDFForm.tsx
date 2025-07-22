"use client";
import { serviceData } from "@/constants/defaultValue";
import { PDFFormProps } from "@/interfaces/timeline";
import React, { useEffect, useState } from "react";
import PdfFormHeader from "../pdfForm/PdfFormHeader";
import ProjectNameNOwner from "../pdfForm/ProjectNameNOwner";
import ClientNDate from "../pdfForm/ClientNDate";
import Location from "../pdfForm/Location";
import Description from "../pdfForm/Description";
import { useGetTimeline } from "@/hooks/useGetTimeline";

const PDFForm = ({ currentText, pdfForm, setPdfForm }: PDFFormProps) => {
  const [selectedService, setSelectedService] = useState<
    { service: string; task: string; price: string; id: number }[]
  >([]);
  const [localServiceData, setLocalServiceData] = useState(serviceData);
  const [isLoading, setIsLoading] = useState(true);
  const { getServiceData } = useGetTimeline();

  const handleCheckboxChange = (
    checked: boolean,
    sectionIndex: number,
    task: string,
    price: string
  ) => {
    const serviceName = localServiceData[sectionIndex]?.name || "";
    if (checked) {
      setSelectedService((prev) => [
        ...prev,
        { service: serviceName, task, price, id: sectionIndex + 1 },
      ]);
    } else {
      setSelectedService((prev) =>
        prev.filter(
          (item) => !(item.service === serviceName && item.task === task)
        )
      );
    }
  };

  useEffect(() => {
    setPdfForm({ ...pdfForm, services: selectedService });
  }, [selectedService]);

  // Fetch service data from API on component mount
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setIsLoading(true);
        const data = await getServiceData();
        setLocalServiceData(data);
      } catch (error) {
        console.error('Error fetching service data:', error);
        // Keep using default serviceData if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, []); // Remove getServiceData from dependency array

  const conChangePrice = (
    event: React.ChangeEvent<HTMLInputElement>,
    sectionIndex: number,
    optionIndex: number,
    section: { name: string },
    item: { task: string }
  ) => {
    const rawValue = event.target.value;
    // ให้เก็บค่าเป็น string ตามที่ผู้ใช้พิมพ์ โดยไม่ใช้ toFixed
    const newPrice = rawValue;

    // อัปเดตใน localServiceData
    setLocalServiceData((prev) => {
      const updated = [...prev];
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        options: [...updated[sectionIndex].options],
      };
      updated[sectionIndex].options[optionIndex] = {
        ...updated[sectionIndex].options[optionIndex],
        price: newPrice,
      };
      return updated;
    });

    // อัปเดตใน selectedService ถ้ามี task นี้
    setSelectedService((prev) =>
      prev.map((s) =>
        s.service === section.name && s.task === item.task
          ? { ...s, price: newPrice }
          : s
      )
    );
  };

  return (
    <div className="group">
      <div className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
        {/* Enhanced header with gradient */}
        <PdfFormHeader />

        <div className="p-10 space-y-8">
          {/* Project Name & Owner */}
          <ProjectNameNOwner
            currentText={currentText}
            pdfForm={pdfForm}
            setPdfForm={setPdfForm}
          />

          {/* Client & Date */}
          <ClientNDate
            currentText={currentText}
            pdfForm={pdfForm}
            setPdfForm={setPdfForm}
          />

          {/* Location */}
          <Location
            currentText={currentText}
            pdfForm={pdfForm}
            setPdfForm={setPdfForm}
          />

          {/* Description */}
          <Description
            currentText={currentText}
            pdfForm={pdfForm}
            setPdfForm={setPdfForm}
          />

          {/* Service Selection */}
          <div className="bg-gray-900 px-6 py-2 rounded-2xl mt-10">
            <h2 className="text-xl font-bold text-white">Service Selection</h2>
            <p className="text-gray-300 text-sm">เลือกรายละเอียดบริการ</p>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2 text-gray-600">กำลังโหลดข้อมูลบริการ...</span>
            </div>
          ) : (
            localServiceData &&
            localServiceData.map((section, i) => {
              return (
                <div key={i}>
                  <label className="block text-md font-semibold text-black mb-3 mt-6">
                    {section.name}
                    <span className="text-sm text-gray-600 block">
                      {section.subtitle}
                    </span>
                  </label>
                  <div className="w-full overflow-x-auto rounded-xl shadow-md border mb-5 border-gray-200">
                    <table className={`w-full text-sm text-left text-gray-900`}>
                      <thead className="bg-gray-100 text-gray-700 text-md">
                        <tr className="border-b border-gray-200">
                          <th className="px-6 py-3 text-center w-[10%]">
                            เลือก
                          </th>
                          <th className="px-6 py-3 text-center w-[70%]">
                            รายการ
                          </th>
                          <th className="px-6 py-3 text-center w-[20%]">
                            เปอร์เซ็นต์ (%)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-50 divide-y divide-x divide-gray-100">
                        {section.options.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 text-center w-[10%]">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    e.target.checked,
                                    i,
                                    item.task,
                                    item.price
                                  )
                                }
                                className="w-4 h-4"
                              />
                            </td>
                            <td className="px-6 py-4 text-center w-[70%]">
                              {item.task}
                            </td>
                            <td className="px-6 py-4 text-center w-[20%]">
                              <div className="flex items-center justify-center gap-2">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  value={section.options[idx].price}
                                  onChange={(e) =>
                                    conChangePrice(e, i, idx, section, item)
                                  }
                                  className="w-20 text-center border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  placeholder="0"
                                />
                                <span className="text-gray-600 text-sm">%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFForm;
