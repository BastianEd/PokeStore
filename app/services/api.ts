import axios from "axios";

/**
 * @description URL base para todas las peticiones a la API del backend.
 * Se obtiene de las variables de entorno del proyecto (Vite), lo que permite
 * configurar diferentes URLs para entornos de desarrollo, staging y producción.
 * @type {string}
 */
export const API_URL = import.meta.env.VITE_API_URL;

/**
 * @description Instancia pre-configurada de `axios` para ser utilizada en toda la aplicación.
 *
 * Esta instancia centraliza la configuración de las llamadas a la API, estableciendo
 * la `baseURL` y las cabeceras por defecto. El uso de una instancia única facilita
 * la implementación de interceptores para manejar la autenticación y los errores de
 * forma global y consistente.
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * @description Interceptor de peticiones de `axios`.
 *
 * Este interceptor se ejecuta *antes* de que cada petición sea enviada. Su principal
 * responsabilidad es adjuntar el token de autenticación (JWT) a las cabeceras
 * de la petición si este existe en el `localStorage`.
 *
 * El chequeo `typeof window !== "undefined"` asegura que el código solo se ejecute
 * en el entorno del navegador, evitando errores durante el renderizado en el servidor (SSR).
 */
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

/**
 * @description Interceptor de respuestas de `axios`.
 *
 * Este interceptor se ejecuta cuando se recibe una respuesta de la API. Se utiliza para
 * manejar errores de forma global.
 *
 * Específicamente, detecta respuestas con estado `401 Unauthorized`, que típicamente
 * indican que el token JWT ha expirado o es inválido. Aunque actualmente solo emite un
 * `console.warn`, se muestra un ejemplo de cómo podría forzar un cierre de sesión
 * y redirigir al usuario a la página de login, centralizando el manejo de sesiones expiradas.
 */
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