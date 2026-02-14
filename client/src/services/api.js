import axios from "axios";

const rawBaseURL = (process.env.REACT_APP_API_URL || "").trim();
const normalizedBaseURL = rawBaseURL
  ? rawBaseURL.replace(/\/+$/, "").endsWith("/api")
    ? rawBaseURL.replace(/\/+$/, "")
    : `${rawBaseURL.replace(/\/+$/, "")}/api`
  : "http://localhost:5000/api";

const API = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
