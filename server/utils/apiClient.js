import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
