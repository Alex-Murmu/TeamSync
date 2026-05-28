
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default api;
