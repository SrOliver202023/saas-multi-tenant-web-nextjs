import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔓 Público
export const corePublicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // garante envio e leitura de cookies
});

// 🔐 Privado
export const corePrivateApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Intercepta respostas (ex: erro 401)
corePrivateApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado — redirecionar para login ou refresh");
    }
    return Promise.reject(error);
  }
);
