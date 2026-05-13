// src/utils/api.js
import axios from "axios";

// ✅ PHP/MySQL backend – php -S localhost:8080 router.php
const api = axios.create({
  baseURL: "http://localhost:8080", // PHP backend base URL
  withCredentials: true, // ✅ send session cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;
