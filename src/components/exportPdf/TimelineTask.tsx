import { TimelineTaskProps } from "@/interfaces/exportPdf";
import React, { FC, useState, useEffect } from "react";

const TimelineTask: FC<TimelineTaskProps> = ({
  workingTasks,
  selectedTasks,
  tableHeaderStyle,
  tableCellStyle,
}) => {
  const [images, setImages] = useState({
    design1: "",
    control1: "",
    build1: "",
  });

  useEffect(() => {
    // Load base64 images
    const loadBase64Images = async () => {
      try {
        const [design1, control1, build1] = await Promise.all([
          fetch("/api/base64/design1").then((res) => res.text()),
          fetch("/api/base64/control1").then((res) => res.text()),
          fetch("/api/base64/build1").then((res) => res.text()),
        ]);

        setImages({
          design1: `data:image/jpeg;base64,${design1}`,
          control1: `data:image/jpeg;base64,${control1}`,
          build1: `data:image/jpeg;base64,${build1}`,
        });
      } catch (error) {
        console.error("Error loading base64 images:", error);
        // Fallback to public images
        setImages({
          design1: "/design1.jpg",
          control1: "/control1.jpg",
          build1: "/build1.jpg",
        });
      }
    };

    loadBase64Images();
  }, []);

  return (
    <>
      {/* Group tasks by service categories */}
      {(() => {
        const serviceCategories = [
          {
            id: "architechture",
            name: "Architectural & Engineering Design | งานออกแบบสถาปัตยกรรมวิศวกรรม",
            image: images.design1,
            tasks: workingTasks.filter(
              (task) =>
                selectedTasks.includes(task.id) &&
                task.category === "architechture"
            ),
          },
          {
            id: "supervistion",
            name: "Construction Supervision | งานควบคุมการก่อสร้าง",
            image: images.control1,
            tasks: workingTasks.filter(
              (task) =>
                selectedTasks.includes(task.id) &&
                task.category === "supervistion"
            ),
          },
          {
            id: "contracting",
            name: "Construction Contracting Services | บริการรับเหมาก่อสร้าง",
            image: images.build1,
            tasks: workingTasks.filter(
              (task) =>
                selectedTasks.includes(task.id) &&
                task.category === "contracting"
            ),
          },
        ];

        return serviceCategories
          .filter((category) => category.tasks.length > 0)
          .map((category, index) => (
            <div
              key={category.id}
              style={{
                pageBreakBefore: index > 0 ? "always" : undefined,
                breakInside: "avoid",
                pageBreakInside: "avoid",
                marginBottom: "20px",
                marginTop: "32px",
              }}
            >
              {/* Service Image - อยู่ข้างบนหัวข้อ */}
              <div
                style={{
                  width: "100%",
                  maxWidth: 500,
                  margin: "56px auto 20px auto",
                  textAlign: "center",
                }}
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      width: "100%",
                      maxWidth: 450,
                      height: "auto",
                      maxHeight: 250,
                    }}
                  />
                )}
              </div>

              {/* Service Category Header - อยู่นอกกรอบสี่เหลี่ยม */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    letterSpacing: 1,
                    color: "#333",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  {category.name}
                </span>
                <div
                  style={{
                    width: 180,
                    height: 3,
                    background: "#bbb",
                    borderRadius: 2,
                  }}
                />
              </div>

              {/* Tasks Table - อยู่ในกรอบสี่เหลี่ยม */}
              <div
                style={{
                  padding: "24px 32px",
                  background: "#fff",
                  borderRadius: 14,
                  maxWidth: 600,
                  marginLeft: "auto",
                  marginRight: "auto",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "16px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>ลำดับ</th>
                      <th style={tableHeaderStyle}>รายการงาน</th>
                      <th style={tableHeaderStyle}>ระยะเวลา (วัน)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.tasks.map((task, taskIndex) => (
                      <tr
                        key={task.id}
                        style={{
                          background: taskIndex % 2 === 0 ? "#f9fafb" : "#fff",
                        }}
                      >
                        <td style={tableCellStyle}>{taskIndex + 1}</td>
                        <td style={tableCellStyle}>{task.name}</td>
                        <td
                          style={{
                            ...tableCellStyle,
                            textAlign: "right" as const,
                          }}
                        >
                          {task.days}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Category Summary */}
                <div
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    background: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#495057",
                    textAlign: "right",
                  }}
                >
                  {(() => {
                    const categoryNames = {
                      architechture: "งานออกแบบสถาปัตยกรรมวิศวกรรม",
                      supervistion: "บริการควบคุมงานก่อสร้าง",
                      contracting: "บริการรับเหมาก่อสร้าง",
                    };
                    const categoryTotalDays = category.tasks.reduce(
                      (sum, task) => sum + Number(task.days),
                      0
                    );
                    return `${
                      categoryNames[category.id as keyof typeof categoryNames]
                    }: ${categoryTotalDays} วัน | ${categoryTotalDays} days`;
                  })()}
                </div>
              </div>
            </div>
          ));
      })()}

      {/* รวมระยะเวลาดำเนินงานทั้งหมด */}
      <div
        style={{
          marginTop: 20,
          padding: "12px 16px",
          background: "#e9ecef",
          border: "1px solid #dee2e6",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 14,
          color: "#222",
          textAlign: "right",
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        รวมระยะเวลาดำเนินงานทั้งหมด:{" "}
        {workingTasks
          .filter((task) => selectedTasks.includes(task.id))
          .reduce((sum, t) => sum + Number(t.days), 0)}{" "}
        วัน
        <br />
        Total Project Duration:{" "}
        {workingTasks
          .filter((task) => selectedTasks.includes(task.id))
          .reduce((sum, t) => sum + Number(t.days), 0)}{" "}
        days
      </div>
    </>
  );
};

export default TimelineTask;
