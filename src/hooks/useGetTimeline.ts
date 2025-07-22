"use client";
import { TaskOption, TaskOptionInsert } from "@/interfaces/timeline";
import { DELETE, GET, GET_TASK_OPTIONS, POST } from "@/services/route";
import { useEffect, useState } from "react";
import { serviceData } from "@/constants/defaultValue";

export const useGetTimeline = () => {
  const [taskOptions, setTaskOptions] = useState<TaskOption[]>([]);

  useEffect(() => {
    fetchTaskOptions();
  }, []);

  const fetchTaskOptions = async () => {
    try {
      const response: { success: boolean; data: any } = await GET(
        GET_TASK_OPTIONS
      );
      if (response.success) {
        setTaskOptions(response.data);
      } else {
        console.error("Failed to fetch task options:", response);
      }
    } catch (error) {
      console.error("Error fetching service options:", error);
    }
  };

  const addTaskOption = async (data: TaskOptionInsert) => {
    try {
      const response: { success: boolean; data: any } = await POST(GET_TASK_OPTIONS, data);
      if (response.success) {
        return response.data;
      } else {
        console.error("Add task failed:", response);
        return null;
      }
    } catch (error) {
      console.error("Error to add Task:", error);
      return null;
    }
  };

  const deleteTaskOption = async (name: string) => {
    try {
      const response: { success: boolean; data: any } = await DELETE(GET_TASK_OPTIONS, { data: { name } });
      if (response.success) {
        console.log("Deleted successfully:", response.data);
        return response.data;
      } else {
        console.error("Delete failed:", response);
        return null;
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      return null;
    }
  };

  const getServiceData = async () => {
    try {
      const response = await fetch("/api/option/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch service data");
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Invalid format");
      }

      const transformedData = result.data.map((category: any) => ({
        name: category.title,
        subtitle: category.subtitle,
        field: category.category,
        options: category.tasks.map((task: string) => ({
          task: task,
          price: "0",
          unit: "%",
        })),
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching service data:", error);
      return serviceData;
    }
  };

  return {
    taskOptions,
    addTaskOption,
    deleteTaskOption,
    getServiceData,
  };
};
