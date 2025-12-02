import type { Route } from "./+types/perfil";
import { Navigate } from "react-router";
import { useAuth } from "~/services/auth-context";
import { useEffect, useState } from "react";

/**
 * @description Genera los metadatos para la página de perfil del usuario.
 * @param {Route.MetaArgs} args - Argumentos proporcionados por el enrutador.
 * @returns {Array<Object>} Un array de objetos de metadatos para el `<head>` del documento.
 */
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Mi Perfil - PokeStore" },
        {
            name: "description",
            content: "Perfil del entrenador en PokeStore",
        },
    ];
}

/**
 * @description Componente que renderiza la página de perfil del usuario autenticado.
 *
 * Esta página está protegida y solo es accesible para usuarios que han iniciado sesión.
 * - **Protección de Ruta**: Si no hay un `usuarioActual` en el contexto de autenticación,
 *   el componente redirige automáticamente a la página de `/login`.
 * - **Visualización de Datos**: Muestra la información del usuario (ID, email, roles) obtenida del `useAuth` hook.
 *   Incluye una lógica para transformar los nombres técnicos de los roles (ej. 'admin') en etiquetas más amigables.
 * - **Historial de Compras**: Renderiza el componente `PurchaseHistory` para mostrar las compras pasadas del usuario.
 *
 * @returns {React.ReactElement} La página de perfil del usuario o un componente `Navigate` para redirigir.
 */
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

                {/* Historial de compras guardado en localStorage por usuario (demo) */}
                <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Historial de Capturas</h3>
                    <PurchaseHistory usuarioId={usuarioActual.id} />
                </div>
            </div>
        </section>
    );
}

/**
 * @description Subcomponente que muestra el historial de compras de un usuario específico.
 *
 * Este componente es responsable de leer y renderizar el historial de compras, que para esta
 * aplicación de demostración se almacena en el `localStorage` del navegador.
 *
 * - **Carga de Datos**: Utiliza `useEffect` para acceder al `localStorage` de forma segura
 *   (solo en el lado del cliente) y obtener los datos de la clave `compras_user_${usuarioId}`.
 * - **Renderizado Condicional**: Muestra un mensaje indicando que no hay compras si el historial está vacío.
 * - **Visualización**: Si existen compras, las renderiza en orden cronológico inverso, mostrando
 *   los detalles de cada transacción.
 *
 * @param {{ usuarioId: number }} props - Las propiedades del componente, incluyendo el ID del usuario.
 * @returns {React.ReactElement} Una lista del historial de compras del usuario.
 */
function PurchaseHistory({ usuarioId }: { usuarioId: number }) {
    const [compras, setCompras] = useState<Array<any>>([]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const key = `compras_user_${usuarioId}`;
            const raw = window.localStorage.getItem(key);
            const parsed = raw ? (JSON.parse(raw) as any[]) : [];
            setCompras(parsed || []);
        } catch (error) {
            console.error("Error leyendo historial de compras:", error);
            setCompras([]);
        }
    }, [usuarioId]);

    if (!compras || compras.length === 0) {
        return (
            <div className="profile-note" style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                Aún no tienes capturas registradas. ¡Atrapa algunos Pokémon en la tienda!
            </div>
        );
    }

    return (
        <div className="purchase-history">
            {compras.slice().reverse().map((compra) => {
                const fecha = new Date(compra.fecha).toLocaleString('es-CL');
                const total = (compra.items || []).reduce((s: number, it: any) => s + (it.precio ?? 0) * (it.quantity ?? 1), 0);

                return (
                    <div key={compra.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong>Compra #{String(compra.id)}</strong>
                            <span style={{ color: '#666' }}>{fecha}</span>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <em>Total: {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)}</em>
                        </div>
                        <div>
                            {(compra.items || []).map((it: any) => (
                                <div key={it.pokedexId} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.25rem 0' }}>
                                    <img src={it.imagen} alt={it.nombre} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{it.nombre}</div>
                                        <div style={{ color: '#666', fontSize: '0.9rem' }}>{it.quantity} × {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(it.precio)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}