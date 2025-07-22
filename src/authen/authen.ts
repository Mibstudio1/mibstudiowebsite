"use client";
import { useEffect } from "react";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { getTokenFromCookie, decodeToken, isTokenValid } from "@/utils/auth";

export const useAuthenEffect = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = () => {
      const token = getTokenFromCookie();
      if (!token) {
        return;
      }

      // Check if token is valid
      if (!isTokenValid(token)) {
        console.log("Token is invalid or expired");
        return;
      }

      const decoded = decodeToken(token);
      if (decoded) {
        dispatch(setUser(decoded));
      }
    };

    // Check token immediately
    checkToken();
    
    // Check token every 3 seconds for better performance
    const interval = setInterval(checkToken, 3000);

    return () => clearInterval(interval);
  }, [dispatch]);
};
