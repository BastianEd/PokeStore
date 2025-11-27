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
    const { usuarioActual } = useAuth();

    if (!usuarioActual) {
        // si no hay sesión, mandar al login
        return <Navigate to="/login" replace />;
    }


    return (
        <section id="perfil" className="section active">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Mi Perfil</h2>
                    <p className="section-subtitle">
                        Aquí puedes ver tus datos básicos.
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

                </div>

                {usuarioActual.compras && usuarioActual.compras.length > 0 ? (
                    <div className="mt-lg">
                        <h4 className="section-subtitle">Tus Pokémon comprados</h4>
                        <div className="profile-pokemon-grid full-width-grid">
                            {usuarioActual.compras.map((c) => (
                                <div key={`${c.pokedexId}-${c.nombre}-${Math.random()}`} className="profile-pokemon-item">
                                    <div className="profile-pokemon-image">
                                        <img src={c.imagen} alt={c.nombre} className="img-no-white" />
                                    </div>
                                    <div className="profile-pokemon-meta">
                                        <div className="profile-pokemon-id">N.º {String(c.pokedexId).padStart(4, '0')}</div>
                                        <h3 className="profile-pokemon-name">{c.nombre}</h3>
                                        <div className="profile-pokemon-tags">
                                            <span className="tag type">{c.tipoPrincipal}</span>
                                            <span className="tag qty">x{c.quantity}</span>
                                            <span className="tag price">
                                                {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(c.precio)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="profile-note">Aún no has comprado Pokémon. ¡Explora la Pokédex y atrápalos! ⚡️</p>
                )}
            </div>
        </section>
    );
}
