import axios from "axios";

// URL base del backend. En local suele ser localhost:3000, pero si deseas cambiarla hazlo en .env .
// NOTA: El backend tiene versionado activado (v1, v2).
// Las rutas de auth parecen no tener versión, pero pokemones sí.
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
            const token = localStorage.getItem("token");
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

// Interceptor: Manejo global de errores (opcional pero recomendado)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Aquí podrías detectar si el error es 401 (No autorizado) y cerrar sesión automáticamente
        if (error.response?.status === 401) {
            // console.warn("Sesión expirada o inválida");
            // window.localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

export default api;