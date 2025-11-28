import { useAuth } from "~/services/auth-context";
import { useNavigate } from "react-router";

export function UserProfile() {
    const { usuarioActual, logout } = useAuth();
    const navigate = useNavigate();

    // Si no hay usuario cargado, no mostramos el componente
    if (!usuarioActual) return null;

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