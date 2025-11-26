// app/services/auth-context.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

const STORAGE_KEY = "mil-sabores-auth";

export type TipoUsuario = "mayor" | "estudiante_duoc" | "regular";

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    password: string;
    tipoUsuario: TipoUsuario;
    fechaNacimiento?: string; // yyyy-mm-dd (opcional para demos)
}

interface AuthState {
    usuarios: Usuario[];
    usuarioActual: Usuario | null;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => void;
    logout: () => void;
    register: (data: {
        nombre: string;
        email: string;
        password: string;
        fechaNacimiento?: string;
    }) => void;
    obtenerBeneficioUsuario: (user?: Usuario | null) => string | null;
}

const DEMO_USERS: Usuario[] = [
    {
        id: "demo-mayor",
        nombre: "Usuario Mayor",
        email: "mayor@gmail.com",
        password: "password123",
        tipoUsuario: "mayor",
        fechaNacimiento: "1950-01-01",
    },
    {
        id: "demo-estudiante",
        nombre: "Estudiante Duoc",
        email: "estudiante@duoc.cl",
        password: "password123",
        tipoUsuario: "estudiante_duoc",
        fechaNacimiento: "2000-01-01",
    },
    {
        id: "demo-regular",
        nombre: "Usuario Regular",
        email: "usuario@gmail.com",
        password: "password123",
        tipoUsuario: "regular",
        fechaNacimiento: "1995-01-01",
    },
];

function cargarEstadoInicial(): AuthState {
    if (typeof window === "undefined") {
        return { usuarios: DEMO_USERS, usuarioActual: null };
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { usuarios: DEMO_USERS, usuarioActual: null };
        }
        const parsed = JSON.parse(raw) as AuthState;

        // Por si acaso nunca se guardaron los demo
        const correosExistentes = new Set(parsed.usuarios.map((u) => u.email));
        const faltantes = DEMO_USERS.filter(
            (d) => !correosExistentes.has(d.email),
        );
        return {
            usuarios: [...parsed.usuarios, ...faltantes],
            usuarioActual: parsed.usuarioActual ?? null,
        };
    } catch {
        return { usuarios: DEMO_USERS, usuarioActual: null };
    }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>(cargarEstadoInicial);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const login: AuthContextValue["login"] = (email, password) => {
        const usuario = state.usuarios.find(
            (u) =>
                u.email.toLowerCase() === email.toLowerCase().trim() &&
                u.password === password,
        );

        if (!usuario) {
            throw new Error("Correo o contraseña incorrectos.");
        }

        setState((prev) => ({ ...prev, usuarioActual: usuario }));
    };

    const logout: AuthContextValue["logout"] = () => {
        setState((prev) => ({ ...prev, usuarioActual: null }));
    };

    const inferirTipoUsuario = (
        email: string,
        fechaNacimiento?: string,
    ): TipoUsuario => {
        if (email.toLowerCase().endsWith("@duoc.cl")) return "estudiante_duoc";

        if (fechaNacimiento) {
            const cumple = new Date(fechaNacimiento);
            const hoy = new Date();
            let edad = hoy.getFullYear() - cumple.getFullYear();
            const m = hoy.getMonth() - cumple.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
                edad--;
            }
            if (edad >= 60) return "mayor";
        }

        return "regular";
    };

    const register: AuthContextValue["register"] = ({
                                                        nombre,
                                                        email,
                                                        password,
                                                        fechaNacimiento,
                                                    }) => {
        const yaExiste = state.usuarios.some(
            (u) => u.email.toLowerCase() === email.toLowerCase().trim(),
        );
        if (yaExiste) {
            throw new Error("Ya existe un usuario registrado con este correo.");
        }

        const tipoUsuario = inferirTipoUsuario(email, fechaNacimiento);

        const nuevo: Usuario = {
            id: `user-${Date.now()}`,
            nombre: nombre.trim(),
            email: email.trim(),
            password,
            tipoUsuario,
            fechaNacimiento,
        };

        setState((prev) => ({
            usuarios: [...prev.usuarios, nuevo],
            usuarioActual: nuevo,
        }));
    };

    const obtenerBeneficioUsuario: AuthContextValue["obtenerBeneficioUsuario"] = (
        user,
    ) => {
        const u = user ?? state.usuarioActual;
        if (!u) return null;

        switch (u.tipoUsuario) {
            case "mayor":
                return "Usuario Mayor · 50% de descuento por edad";
            case "estudiante_duoc":
                return "Estudiante Duoc · Torta de cumpleaños gratis";
            case "regular":
                return "Usuario Regular · Descuentos con códigos y promociones";
            default:
                return null;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                register,
                obtenerBeneficioUsuario,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return ctx;
}
