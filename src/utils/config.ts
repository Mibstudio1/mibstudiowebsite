export const config = {
  // Authentication settings
  auth: {
    tokenCookieName: "token",
    tokenExpiryDays: 7,
    redirectDelay: process.env.NODE_ENV === "production" ? 1000 : 500,
  },
  
  // API settings
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    timeout: 10000,
  },
  
  // Environment detection
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};

export const getRedirectDelay = (): number => {
  return config.auth.redirectDelay;
};

export const isProduction = (): boolean => {
  return config.isProduction;
}; 