import axios, { AxiosRequestConfig, AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true,
});

function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    throw {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    };
  }
  throw error;
}

export async function GET<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await api.get<T>(url, config);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function POST<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await api.post<T>(url, data, config);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function PUT<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await api.put<T>(url, data, config);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function DELETE<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await api.delete<T>(url, config);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export const POST_LOGIN = "/api/authen/login";
export const POST_LOGOUT = "/api/authen/logout";
export const POST_REGISTER = "/api/authen/registor";
export const POST_CREATE_NOTE = "/api/note/create";
export const POST_NOTE = "/api/note";

export const GET_TASK_OPTIONS = "/api/option/tasks";
export const GET_PDF_FILE = "/api/upload-pdf";