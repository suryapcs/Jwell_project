// src/utils/api.js
import axios from "axios";

// ✅ Create an axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000", // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;
