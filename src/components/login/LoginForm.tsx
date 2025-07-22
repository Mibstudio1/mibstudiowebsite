"use client";
import React, { useEffect, useState } from "react";
import { CustomInput } from "../input/CustomInput";
import { useAuthen } from "@/hooks/login/useAuthen";
import { REGISTER_FIELD } from "@/constants/login";
import { useRouter } from "next/navigation";
import { loginSchema, registerSchema } from "@/schema/frontend/authen";
import { renderZodErrors } from "@/utils/fn";
import { getRedirectDelay } from "@/utils/config";

const LoginForm = () => {
  const router = useRouter();
  const [isLoginPage, setIsloginPage] = useState(true);
  const [customerId, setCustomerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    company: "",
    phone: "",
    address: "",
  });

  const { login, register } = useAuthen();

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = loginSchema.safeParse({ customerId });
    if (!result.success) {
      alert(result.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const { success } = await login(customerId);
      if (!success) {
        alert("เข้าสู่ระบบล้มเหลว โปรดตรวจสอบรหัสลูกค้าและลองอีกครั้ง");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      
      // Add a delay to ensure cookie is set and authentication state is updated
      const redirectDelay = getRedirectDelay();
      setTimeout(() => {
        // Use window.location.href for production to ensure proper redirect
        window.location.href = "/notes";
      }, redirectDelay);
    } catch (error) {
      console.error("Login error:", error);
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
      setIsLoading(false);
    }
  };

  const labelMap = REGISTER_FIELD.reduce<Record<string, string>>((acc, cur) => {
    acc[cur.name] = cur.label;
    return acc;
  }, {});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = registerSchema.safeParse(registerData);
    if (!result.success) {
      const errMsg = renderZodErrors(result.error, labelMap);
      alert(errMsg);
      setIsLoading(false);
      return;
    }
    const { name, company, phone, address } = result.data;
    const newData = {
      customerName: name,
      companyName: company,
      phone,
      address,
    };
    const {
      success,
      message,
      result: registerResult,
    } = await register(newData);
    if (!success) {
      alert(message || "การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);

    const customerId = registerResult?.customerId;
    if (customerId) {
      const copyToClipboard = () => {
        navigator.clipboard
          .writeText(customerId)
          .then(() => {
            alert("คัดลอกรหัสสมาชิกแล้ว!");
          })
          .catch(() => {
            const textArea = document.createElement("textarea");
            textArea.value = customerId;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            alert("คัดลอกรหัสสมาชิกแล้ว!");
          });
      };

      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
      modal.innerHTML = `
        <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
          <h2 class="text-lg font-bold text-gray-900">Register Success!</h2>
          <h2 class="text-sm font-light text-gray-600 mb-4">ลงทะเบียนสำเร็จ!</h2>
          <p class="text-gray-600">Your Customer Code:</p>
          <p class="text-gray-400 mb-6 text-sm">รหัสสมาชิกของคุณคือ:</p>
          <div class="bg-gray-100 p-4 rounded-lg mb-6">
            <div class="text-2xl font-bold text-gray-900 mb-3">${customerId}</div>
            <button id="copyBtn" class="bg-gradient-to-r from-gray-800 to-black text-white px-6 py-2 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105">
              คัดลอกรหัส
            </button>
          </div>
          <p class="text-sm text-gray-500 mb-6">Please Save This Code</p>
          <p class="text-sm text-gray-500 mb-6">กรุณาจดบันทึกรหัสนี้ไว้สำหรับการเข้าสู่ระบบ</p>
          <button id="closeBtn" class="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300">
            เข้าใจแล้ว
          </button>
        </div>
      `;

      document.body.appendChild(modal);

      // Event listeners
      const copyBtn = modal.querySelector("#copyBtn");
      const closeBtn = modal.querySelector("#closeBtn");

      copyBtn?.addEventListener("click", copyToClipboard);
      closeBtn?.addEventListener("click", () => {
        document.body.removeChild(modal);
        setIsloginPage(true);
        setRegisterData({
          name: "",
          company: "",
          phone: "",
          address: "",
        });
      });

      // Close on backdrop click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          setIsloginPage(true);
          setRegisterData({
            name: "",
            company: "",
            phone: "",
            address: "",
          });
        }
      });
    } else {
      alert("ลงทะเบียนสำเร็จ!");
      setIsloginPage(true);
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-900 to-black md:bg-white md:bg-none flex flex-col justify-center px-3 md:px-10 py-4 md:py-8">
      {isLoginPage ? (
        <>
          <div className="flex md:hidden justify-center items-center mt-[-100px]">
            <img
              src="/logo.png"
              alt="MIB Studio Logo"
              width="300"
              height="300"
              className="object-contain max-w-full h-auto"
              style={{ maxWidth: "300px", maxHeight: "300px" }}
            />
          </div>
          <div className="mt-[-80px] md:mt-0">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white md:text-gray-800">
                Sign in
              </h2>
              <h2 className="text-xl font-light text-white opacity-80 md:text-gray-600 mb-2">
                ลงชื่อเข้าใช้
              </h2>
            </div>

            <form className="flex flex-col space-y-6">
              <CustomInput
                type="text"
                placeholder="กรุณากรอกรหัสลูกค้า..."
                value={customerId}
                label="รหัสลูกค้า"
                labelEn="Customer Code"
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />

              <button
                className="bg-white md:bg-gradient-to-r md:from-gray-800 md:to-black text-gray-800 md:text-white py-3 px-6 rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={handleLogin}
                disabled={isLoading}
              >
                <div className="flex gap-4 justify-center items-center">
                  <div className="flex flex-col">เข้าสู่ระบบ</div>
                  {isLoading && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                </div>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsloginPage(!isLoginPage)}
                >
                  <p className="text-sm text-white md:text-gray-600 md:hover:text-gray-800 underline cursor-pointer transition-colors duration-200">
                    Sign up
                  </p>
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <div className="text-center mb-6">
            <h2 className="text-base md:text-xl font-bold text-white md:text-gray-800">
              Sign Up
            </h2>
            <h2 className="text-sm md:text-base font-light text-white md:text-gray-600">
              ลงทะเบียนลูกค้าใหม่
            </h2>
            <div className="w-12 h-1 bg-gray-800 rounded-full mx-auto"></div>
          </div>

          <form className="flex flex-col space-y-2 md:space-y-4">
            {REGISTER_FIELD.map(
              ({ label, name, placeholder, type, labelEn }) => (
                <CustomInput
                  key={name}
                  type={type}
                  label={label}
                  labelEn={labelEn}
                  placeholder={placeholder}
                  value={(registerData as any)[name]}
                  name={name}
                  onChange={handleRegisterInputChange}
                  required
                />
              )
            )}

            <button
              className="bg-white md:bg-gradient-to-r md:from-gray-800 md:to-black text-gray-800 md:text-white font-semibold py-3 px-6 rounded-lg 
             hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform 
             hover:scale-105 shadow-lg hover:shadow-xl mt-4 md:mt-0
             disabled:from-gray-500 disabled:to-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleRegister}
              disabled={isLoading}
            >
              <div className="flex text-sm md:text-base gap-4 justify-center items-center">
                เข้าสู่ระบบลูกค้าใหม่
                {isLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
              </div>
            </button>
          </form>

          <div className="text-center">
            <button type="button" onClick={() => setIsloginPage(!isLoginPage)}>
              <p className="text-xs md:text-sm text-white md:text-gray-600 hover:text-gray-800 underline cursor-pointer transition-colors duration-200">
                Sign in
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
