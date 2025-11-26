// app/routes/perfil.tsx
import type { Route } from "./+types/perfil";
import { Navigate } from "react-router";
import { useAuth } from "~/services/auth-context";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Mi Perfil - Pastelería Mil Sabores" },
        {
            name: "description",
            content: "Perfil del usuario y beneficios en Pastelería Mil Sabores.",
        },
    ];
}

export default function PerfilPage() {
    const { usuarioActual, obtenerBeneficioUsuario } = useAuth();

    if (!usuarioActual) {
        // si no hay sesión, mandar al login
        return <Navigate to="/login" replace />;
    }

    const beneficio = obtenerBeneficioUsuario(usuarioActual);

    return (
        <section id="perfil" className="section active">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Mi Perfil</h2>
                    <p className="section-subtitle">
                        Aquí puedes ver tus datos básicos y tus beneficios como cliente.
                    </p>
                </div>

                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <i className="fas fa-user" />
                        </div>
                        <div>
                            <h3 className="profile-name">
                                {usuarioActual.nombre || "Cliente Mil Sabores"}
                            </h3>
                            <p className="profile-email">{usuarioActual.email}</p>
                        </div>
                    </div>

                    {beneficio && (
                        <div className="profile-benefit">
                            <i className="fas fa-gift" /> {beneficio}
                        </div>
                    )}

                    <div className="profile-details">
                        <p>
                            <strong>Tipo de usuario:</strong> {usuarioActual.tipoUsuario}
                        </p>
                        {usuarioActual.fechaNacimiento && (
                            <p>
                                <strong>Fecha de nacimiento:</strong>{" "}
                                {usuarioActual.fechaNacimiento}
                            </p>
                        )}
                    </div>

                    <p className="profile-note">
                        Muy pronto podrás ver aquí tu historial de pedidos y tortas
                        favoritas. 🍰
                    </p>
                </div>
            </div>
        </section>
    );
}
