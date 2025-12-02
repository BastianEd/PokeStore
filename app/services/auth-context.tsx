import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "jwt_token";

export interface Usuario {
    id: number;
    email: string;
    nombre: string; // <--- Campo nombre agregado
    roles: string[];
}

interface AuthState {
    usuarioActual: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (nombre: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    agregarCompras: (items: Array<Record<string, any>>) => { id: number; fecha: string; items: Array<Record<string, any>> } | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        usuarioActual: null,
        isAuthenticated: false,
        isLoading: true,
    });

    const cargarUsuarioDesdeToken = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);

            // 1. Buscamos 'role' (lo que manda tu backend actual) O 'roles' (por si lo cambias a futuro).
            // 2. Normalizamos para asegurar que siempre trabajamos con un Array.
            const rawRole = decoded.role || decoded.roles;

            const rolesDelToken = Array.isArray(rawRole)
                ? rawRole
                : (rawRole ? [rawRole] : []); // Si es string, lo envolvemos en array

            const usuario: Usuario = {
                email: decoded.email || "",
                nombre: decoded.name, // Nota: Asegúrate que el token traiga 'name', si no, usa decoded.email
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
            logout();
        }
    };

    useEffect(() => {
        // Al iniciar la app, solo buscamos un token existente
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            cargarUsuarioDesdeToken(token);
        } else {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

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

    const register = async (nombre: string, email: string, password: string) => {
        try {
            await api.post("/auth/register", { name: nombre, email, password });
            // Hacemos login automático tras el registro exitoso
            await login(email, password);
        } catch (error: any) {
            console.error("Error Registro:", error);
            throw new Error(error.response?.data?.message || "Error al registrarse");
        }
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setState({
            usuarioActual: null,
            isAuthenticated: false,
            isLoading: false,
        });
        window.location.href = "/login";
    };

    // Guarda compras simples en localStorage por usuario (demo local)
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

            // Notificar al resto de la app que las ventas han cambiado (actualización en tiempo real del gráfico)
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

    // Calculamos si es admin basándonos únicamente en los roles del usuario autenticado
    const isAdmin = state.usuarioActual?.roles.includes("admin") ?? false;

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, isAdmin, agregarCompras }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
}