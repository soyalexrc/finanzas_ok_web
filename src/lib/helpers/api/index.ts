import axios from "axios";
import { toast } from "sonner";

let isAlertShown = false; // Prevent multiple alerts

// Logout function
const logoutUser = async () => {
  try {
    await sessionStorage.removeItem("access_token"); // Remove stored token
    await sessionStorage.removeItem("user"); // Remove stored token
    isAlertShown = false; // Reset flag when user logs out
    // Redirect to login screen
    window.location.href = "/auth";
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error.response);
    // if (error.response?.status === 401 && !isAlertShown) {
      // isAlertShown = true; // Set flag to prevent multiple alerts
      // toast.error("Su sesión ha vencido. Por favor, inicie sesión nuevamente.");
      // await logoutUser();
    // }
    return Promise.reject(error);
  }
);

export default api;

export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    checkUserByEmail: "/auth/checkUserByEmail",
    completeAuthentication: "/auth/completeAuthentication",
    completeRegistration: "/auth/completeRegistration",
    loginOrRegister: "/auth/loginOrRegister",
    requestOtp: "/auth/requestOtp",
    startAuthentication: "/auth/startAuthentication",
    validateEmailForRegister: "/auth/validateEmailForRegister",
    verifyOtp: "/auth/verifyOtp",
  },
  categories: {
    listByUser: "/category/byUser",
    create: "/category",
  },
  calendar: {
    list: "/calendar-events/getEventsForDateRange",
  },
  currencies: {
    list: "currency",
  },
  user: {
    markFavCurrency: "/user/markFavCurrency",
  },
  transactions: {
    listByUser: "/transaction/byUser",
    create: "/transaction",
    update: "/transaction",
    delete: "/transaction",
    getYearlyExpensesByCategory: "/transaction/getYearlyExpensesByCategory",
    getMonthlyStatistics: "/transaction/getMonthlyStatistics",
    getStatisticsByCurrencyAndYear:
      "/transaction/getStatisticsByCurrencyAndYear",
    getMonthlyTotalsByCategory: "/transaction/getMonthlyExpensesByCategory",
  },
};
