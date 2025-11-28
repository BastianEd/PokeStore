import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import api from "../services/api"; // Importamos nuestra instancia de Axios
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "jwt_token";

export interface Usuario {
    id: number; // Tu backend usa number para ID
    email: string;
    roles: string[]; // Tu backend maneja roles
    // Agrega más campos si el payload del token los trae
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
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        usuarioActual: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Función auxiliar para decodificar el token y setear el usuario
    const cargarUsuarioDesdeToken = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            // Ajusta estos campos según lo que tu Backend guarde en el JWT payload
            const usuario: Usuario = {
                id: decoded.sub, // 'sub' suele ser el ID en JWT estándar
                email: decoded.email || "", // Asegúrate que tu backend incluya el email en el payload
                roles: decoded.roles || [],
            };

            setState({
                usuarioActual: usuario,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            logout();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            cargarUsuarioDesdeToken(token);
        } else {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // Tu AuthController no tiene versión, así que es /auth/login
            const { data } = await api.post("/auth/login", { email, password });

            // Asumiendo que el backend devuelve { access_token: "..." }
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
            // Tu AuthController: /auth/register
            await api.post("/auth/register", { name: nombre, email, password });
            // Después del registro, podrías hacer login automático o pedir que inicie sesión
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
        window.location.reload() //Recargamos para limpiar estados de memoria
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
}