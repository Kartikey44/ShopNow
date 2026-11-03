import axios from "axios";
import { normalizeApiBaseUrl } from "./normalizeApiBaseUrl";

const axiosInstance = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_BACKEND_SERVER),
  withCredentials: true,
});

export default axiosInstance;
