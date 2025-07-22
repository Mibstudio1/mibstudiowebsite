import { jwtDecode } from "jwt-decode";

export type DecodedToken = {
  customerId: string;
  name: string;
  companyName?: string;
  id?: string;
};

export const getTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token has expired
    if (decoded.exp && decoded.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

export const clearAuthToken = (): void => {
  if (typeof document === "undefined") return;
  
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}; 