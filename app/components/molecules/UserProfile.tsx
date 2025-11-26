// app/components/organisms/UserProfile.tsx
import { useEffect, useState } from "react";

export type UsuarioTipo = "mayor" | "estudiante" | "regular";

export type UsuarioActual = {
    email: string;
    tipo: UsuarioTipo;
};

const CURRENT_USER_KEY = "usuario_actual_mil_sabores";

function leerUsuarioActual(): UsuarioActual | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(CURRENT_USER_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as UsuarioActual;
    } catch {
        return null;
    }
}

// 👇 hook reutilizable
export function useCurrentUser() {
    const [user, setUser] = useState<UsuarioActual | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const sync = () => {
            setUser(leerUsuarioActual());
        };

        sync();

        const handler = () => sync();
        window.addEventListener("storage", handler);
        window.addEventListener("usuario_actual_mil_sabores_changed", handler);

        return () => {
            window.removeEventListener("storage", handler);
            window.removeEventListener("usuario_actual_mil_sabores_changed", handler);
        };
    }, []);

    return user;
}

export function UserProfile() {
    const currentUser = useCurrentUser();

    if (!currentUser) return null;

    const handleLogout = () => {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(CURRENT_USER_KEY);
        window.dispatchEvent(new Event("usuario_actual_mil_sabores_changed"));
        window.location.href = "/login";
    };

    const labelPorTipo: Record<UsuarioTipo, string> = {
        mayor: "Usuario Mayor - 50% descuento",
        estudiante: "Estudiante Duoc - Torta de cumpleaños",
        regular: "Usuario Regular",
    };

    return (
        <div className="user-info">
            <div className="user-summary">
                <span className="user-email">{currentUser.email}</span>
                <span className="user-type">{labelPorTipo[currentUser.tipo]}</span>
            </div>
            <button type="button" className="btn-link" onClick={handleLogout}>
                Cerrar sesión
            </button>
        </div>
    );
}
