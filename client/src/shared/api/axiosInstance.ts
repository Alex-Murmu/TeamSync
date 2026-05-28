import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

console.log("API Base URL:", API_BASE_URL);
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirecting = false;

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (!isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.assign("/login");
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      const message =
        (error.response.data as { message?: string })?.message ||
        "You do not have permission to perform this action.";
      toast.error(message);
    }

    if (error.response?.status === 500) {
      const message =
        (error.response.data as { message?: string })?.message ||
        "Internal server error. Please try again later.";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
