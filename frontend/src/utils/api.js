// src/utils/api.js
import axios from "axios";

// ✅ Live PHP/MySQL backend on pcstech.in
const api = axios.create({
  baseURL: "https://pcstech.in/jewelry_api", // Live production API
  withCredentials: true, // ✅ send session cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;
