import type { Route } from "./+types/perfil";
import { Navigate } from "react-router";
import { useAuth } from "~/services/auth-context";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Mi Perfil - PokeStore" },
        {
            name: "description",
            content: "Perfil del entrenador en PokeStore",
        },
    ];
}

export default function PerfilPage() {
    const { usuarioActual } = useAuth();

    // Protección de ruta: si no hay usuario, redirigir a login
    if (!usuarioActual) {
        return <Navigate to="/login" replace />;
    }

    // Mapeo de roles para mostrar nombres más amigables
    const rolesLegibles = usuarioActual.roles?.map(role => {
        if (role === 'admin') return 'Profesor Pokémon (Admin)';
        if (role === 'user') return 'Entrenador (Usuario)';
        return role;
    }).join(', ') || 'Entrenador';

    return (
        <section id="perfil" className="section active">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Tarjeta de Entrenador</h2>
                    <p className="section-subtitle">
                        Información de tu licencia oficial.
                    </p>
                </div>

                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {/* Mostramos icono según el rol */}
                            <i className={`fas ${usuarioActual.roles.includes('admin') ? 'fa-user-shield' : 'fa-user'}`} />
                        </div>
                        <div>
                            <h3 className="profile-name">
                                {/* El token JWT estándar no siempre trae el nombre, usamos el email como fallback */}
                                {usuarioActual.email.split('@')[0]}
                            </h3>
                            <p className="profile-email">{usuarioActual.email}</p>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="profile-item" style={{ marginBottom: '10px' }}>
                            <strong>ID de Entrenador:</strong>
                            <span style={{ marginLeft: '8px', color: '#666' }}>#{String(usuarioActual.id).padStart(4, '0')}</span>
                        </div>

                        <div className="profile-item">
                            <strong>Rango Actual:</strong>
                            <span className="tag type" style={{ marginLeft: '8px', backgroundColor: '#3B5AA6' }}>
                                {rolesLegibles}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sección informativa placeholder */}
                <div className="mt-lg text-center" style={{ padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '15px' }}>
                    <i className="fas fa-exclamation-circle" style={{ fontSize: '2rem', color: '#ccc', marginBottom: '1rem' }}></i>
                    <p className="profile-note">
                        El historial de capturas (compras) se está sincronizando con la PC de Bill. <br/>
                        Pronto podrás ver tus Pokémon aquí.
                    </p>
                </div>
            </div>
        </section>
    );
}