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
        return;
      }

      const decoded = decodeToken(token);
      if (decoded) {
        dispatch(setUser(decoded));
      }
    };

    // Check token immediately
    checkToken();
    
    // Check token every 5 seconds for better performance
    const interval = setInterval(checkToken, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);
};
