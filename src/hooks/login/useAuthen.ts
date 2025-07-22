import { POST, POST_LOGIN, POST_REGISTER } from "@/services/route";

interface RegisterProps {
  customerName: string;
  companyName: string;
  phone: string;
  address: string;
}

export const useAuthen = () => {
  const login = async (customerId: string) => {
    try {
      const response: { success: boolean; result?: any } = await POST(
        POST_LOGIN,
        { customerId }
      );

      const { success, result } = response;
      if (!success) {
        return { success };
      }
      return { result, success };
    } catch (error: any) {
      console.error("Login failed:", error);
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      throw error;
    }
  };

  const register = async (value: RegisterProps) => {
    try {
      const response: { success: boolean; result?: any; message: string } =
        await POST(POST_REGISTER, value);

      const { success, result, message } = response;
      if (!success) {
        return { success, message };
      }
      return { success, result };
    } catch (error: any) {
      console.error("Login failed:", error);
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      throw error;
    }
  };

  return { login, register };
};
