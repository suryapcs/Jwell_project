// src/utils/Toast.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Common toast functions
export const Toast = {
  success: (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  info: (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  warn: (message, options = {}) => {
    toast.warn(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },
};
