import axios from "axios";
import type { AxiosInstance } from "axios";

const aiApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AI_API_URL as string,
});

export default aiApi;