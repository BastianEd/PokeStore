import axios from "axios";

// URL base del backend.
export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor: Antes de cada petición, adjuntar el token si existe.
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            // CORRECCIÓN AQUÍ: Usamos "jwt_token" para coincidir con auth-context
            const token = localStorage.getItem("jwt_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor: Manejo global de errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si el error es 401, el token venció o es inválido.
        if (error.response?.status === 401) {
            console.warn("Sesión no autorizada o expirada.");
            // Opcional: Podrías forzar logout aquí si quisieras
            // localStorage.removeItem("jwt_token");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;