import { useAuth } from "~/services/auth-context";
import { useNavigate } from "react-router";

/**
 * @description Componente que muestra la información del usuario actualmente autenticado y ofrece una opción para cerrar sesión.
 *
 * Este componente se integra con el `useAuth` hook para obtener los datos del `usuarioActual`.
 * Si no hay un usuario en sesión, el componente no se renderiza (retorna `null`).
 * Muestra el nombre, email y un rol legible del usuario ('Profesor Pokémon' para administradores, 'Entrenador' para otros).
 * Incluye un botón "Salir" que invoca la función `logout` del contexto de autenticación y redirige
 * al usuario a la página de login.
 *
 * @returns {React.ReactElement | null} El perfil del usuario o `null` si no hay sesión activa.
 */
export function UserProfile() {
    const { usuarioActual, logout } = useAuth();
    const navigate = useNavigate();

    // Si no hay usuario cargado, no mostramos el componente
    if (!usuarioActual) return null;

    /**
     * @description Maneja el proceso de cierre de sesión.
     * Llama a la función `logout` del `auth-context` para limpiar el estado de autenticación
     * y luego redirige al usuario a la página de login.
     */
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Transformamos los roles técnicos a texto amigable
    const rolLegible = usuarioActual.roles?.includes('admin')
        ? 'Profesor Pokémon'
        : 'Entrenador';

    return (
        <div className="user-info">
            <div className="user-summary">
                {/* AQUI ESTÁ LA CLAVE: Usamos .nombre */}
                <span className="user-name" style={{
                    fontWeight: "800",
                    color: "#3B5AA6", // Azul PokeStore
                    fontSize: "1rem",
                    display: "block",
                    fontFamily: "'Lato', sans-serif"
                }}>
                    {/* Si por error el nombre viene vacío, mostramos "Entrenador" */}
                    {usuarioActual.nombre || "Entrenador"}
                </span>

                <span className="user-email" style={{ fontSize: "0.8rem", color: "#666" }}>
                    {usuarioActual.email}
                </span>

                <span className="user-role" style={{
                    fontSize: "0.75rem",
                    color: "#e67e22",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                }}>
                    {rolLegible}
                </span>
            </div>

            <button
                type="button"
                className="btn-link"
                onClick={handleLogout}
                style={{
                    marginLeft: "15px",
                    color: "#e74c3c",
                    fontSize: "0.9rem",
                    textDecoration: "underline",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: 0
                }}
            >
                Salir
            </button>
        </div>
    );
}