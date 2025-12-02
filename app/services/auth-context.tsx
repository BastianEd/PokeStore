import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

// Clave utilizada para almacenar el token JWT en localStorage. Centralizarla como constante previene errores de tipeo.
const TOKEN_KEY = "jwt_token";

/**
 * @interface Usuario
 * @description Define la estructura de datos para el usuario autenticado en la aplicación.
 * @property {number} id - El identificador único del usuario (generalmente `sub` del token JWT).
 * @property {string} email - El correo electrónico del usuario.
 * @property {string} nombre - El nombre del usuario.
 * @property {string[]} roles - Un array de roles asignados al usuario (ej. ['admin', 'user']).
 */
export interface Usuario {
    id: number;
    email: string;
    nombre: string;
    roles: string[];
}

/**
 * @interface AuthState
 * @description Representa el estado de autenticación en un momento dado.
 * @property {Usuario | null} usuarioActual - El objeto del usuario si está autenticado, o `null` si no lo está.
 * @property {boolean} isAuthenticated - Un booleano que indica si hay una sesión activa.
 * @property {boolean} isLoading - Indica si el estado de autenticación se está determinando (ej. al cargar la app).
 */
interface AuthState {
    usuarioActual: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

/**
 * @interface AuthContextValue
 * @description Define el valor completo que provee el `AuthContext`, incluyendo el estado y las funciones para modificarlo.
 */
interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (nombre: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    agregarCompras: (items: Array<Record<string, any>>) => { id: number; fecha: string; items: Array<Record<string, any>> } | null;
}

// Creación del contexto de React. Se inicializa como `undefined` y se proveerá un valor en `AuthProvider`.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * @description Proveedor de contexto que encapsula toda la lógica de autenticación.
 * Gestiona el estado del usuario, interactúa con la API para login/registro, y persiste
 * la sesión utilizando `localStorage`.
 * @param {{ children: ReactNode }} props - Los componentes hijos que tendrán acceso a este contexto.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        usuarioActual: null,
        isAuthenticated: false,
        isLoading: true,
    });

    /**
     * @description Decodifica un token JWT, extrae la información del usuario y actualiza el estado de autenticación.
     * Normaliza el campo de roles para asegurar que siempre sea un array.
     * @param {string} token - El token JWT a procesar.
     */
    const cargarUsuarioDesdeToken = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);

            // Normaliza el campo de roles para asegurar que siempre sea un array,
            // manejando tanto 'role' (string) como 'roles' (array).
            const rawRole = decoded.role || decoded.roles;
            const rolesDelToken = Array.isArray(rawRole)
                ? rawRole
                : (rawRole ? [rawRole] : []);

            const usuario: Usuario = {
                email: decoded.email || "",
                nombre: decoded.name, // Asegúrate que el token JWT incluya el campo 'name'.
                id: decoded.sub,
                roles: rolesDelToken,
            };

            setState({
                usuarioActual: usuario,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            console.error("Error al decodificar token:", error);
            logout(); // Si el token es inválido, se fuerza el cierre de sesión.
        }
    };

    // Efecto que se ejecuta una sola vez al montar el componente para restaurar la sesión.
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            cargarUsuarioDesdeToken(token);
        } else {
            // Si no hay token, simplemente se finaliza el estado de carga.
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    /**
     * @description Realiza una petición de login a la API. Si es exitosa, guarda el token y actualiza el estado.
     * @throws {Error} Lanza un error con un mensaje descriptivo si el login falla.
     */
    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            const token = data.access_token;

            localStorage.setItem(TOKEN_KEY, token);
            cargarUsuarioDesdeToken(token);
        } catch (error: any) {
            console.error("Error Login:", error);
            throw new Error(error.response?.data?.message || "Error al iniciar sesión");
        }
    };

    /**
     * @description Realiza una petición de registro a la API. Si es exitosa, procede a hacer login automáticamente.
     * @throws {Error} Lanza un error con un mensaje descriptivo si el registro falla.
     */
    const register = async (nombre: string, email: string, password: string) => {
        try {
            await api.post("/auth/register", { name: nombre, email, password });
            // Tras un registro exitoso, se inicia sesión automáticamente para mejorar la UX.
            await login(email, password);
        } catch (error: any) {
            console.error("Error Registro:", error);
            throw new Error(error.response?.data?.message || "Error al registrarse");
        }
    };

    /**
     * @description Cierra la sesión del usuario, eliminando el token y reseteando el estado.
     * Redirige forzosamente a la página de login.
     */
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setState({
            usuarioActual: null,
            isAuthenticated: false,
            isLoading: false,
        });
        window.location.href = "/login"; // Redirección forzada para limpiar cualquier estado residual de la app.
    };

    /**
     * @description (Función de Demo) Guarda un registro de compra en `localStorage` asociado al ID del usuario.
     * Dispara un evento personalizado `ventas:actualizado` para notificar a otros componentes (como gráficos)
     * que los datos de ventas han cambiado, permitiendo una actualización en tiempo real de la UI.
     * @param {Array<Record<string, any>>} items - Los ítems de la compra.
     * @returns {object | null} El objeto de la nueva compra o `null` si falla.
     */
    const agregarCompras = (items: Array<Record<string, any>>) => {
        const usuario = state.usuarioActual;
        if (!usuario) {
            console.warn("agregarCompras: no hay usuario autenticado");
            return null;
        }

        try {
            const key = `compras_user_${usuario.id}`;
            const raw = localStorage.getItem(key);
            const existing = raw ? (JSON.parse(raw) as any[]) : [];

            const nuevaCompra = {
                id: Date.now(),
                fecha: new Date().toISOString(),
                items,
            };

            const updated = [...existing, nuevaCompra];
            localStorage.setItem(key, JSON.stringify(updated));

            // Dispara un evento global para que otros componentes puedan reaccionar.
            try {
                const evt = new CustomEvent('ventas:actualizado', { detail: { userId: usuario.id, compra: nuevaCompra } });
                window.dispatchEvent(evt);
            } catch {}

            return nuevaCompra;
        } catch (error) {
            console.error("Error guardando compras locales:", error);
            return null;
        }
    };

    // Propiedad computada que determina si el usuario es administrador.
    // Se deriva directamente del estado, asegurando que siempre esté actualizada.
    const isAdmin = state.usuarioActual?.roles.includes("admin") ?? false;

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, isAdmin, agregarCompras }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * @description Hook personalizado para consumir el `AuthContext`.
 * Proporciona una forma segura y tipada de acceder al estado y funciones de autenticación.
 * @throws {Error} Lanza un error si se intenta usar fuera de un `AuthProvider`.
 * @returns {AuthContextValue} El valor completo del contexto de autenticación.
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
}