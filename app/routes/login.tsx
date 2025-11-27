import type { Route } from "./+types/login";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "~/services/auth-context";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Acceso de Entrenadores - Pokémon Trading Co." },
        {
            name: "description",
            content: "Inicia sesión para gestionar tu Pokédex de pedidos y beneficios.",
        },
    ];
}

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        setError(null);

        if (!email || !password) {
            setError("Por favor ingresa tu correo y contraseña.");
            return;
        }

        try {
            setLoading(true);
            login(email, password);
            navigate("/", { replace: true });
        } catch (err: any) {
            setError(err?.message ?? "Correo o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="login" className="section active">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Acceso de Entrenadores</h2>
                    <p className="section-subtitle">
                        Accede a tu cuenta para gestionar tus pedidos de Pokémon y ver tus beneficios especiales.
                    </p>
                </div>

                <div className="form-container">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login-email">Correo electrónico</label>
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                required
                                placeholder="tu@correo.cl"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password">Contraseña</label>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                required
                                placeholder="Ingresa tu contraseña"
                            />
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <button type="submit" className="btn-primary full-width" disabled={loading}>
                            {loading ? "Ingresando..." : "Iniciar Sesión"}
                        </button>

                        <div className="form-footer">
                            <p>
                                ¿No tienes cuenta?{" "}
                                <Link to="/registro" className="link">
                                    Regístrate aquí
                                </Link>
                            </p>
                            <p className="form-help">
                                ¿Olvidaste tu contraseña?{" "}
                                <Link to="/recuperar">Recuperar contraseña</Link>
                            </p>
                        </div>
                    </form>

                    <aside className="auth-benefits">
                        <h3>Beneficios de ser un Entrenador Registrado</h3>
                        <ul>
                            <li>⚡️ Guardar tus Pokémon favoritos en tu Pokédex personal</li>
                            <li>📦 Seguir el estado de tus intercambios y capturas</li>
                            <li>🎉 Descuentos exclusivos en Pokeballs y accesorios</li>
                            <li>🏆 Sorpresas especiales al alcanzar nuevos rangos</li>
                        </ul>
                    </aside>
                </div>

                <div className="demo-users">
                    <h4>👥 Cuentas de Prueba:</h4>
                    <div className="demo-user">
                        <strong>Profesor Pokémon:</strong> mayor@gmail.com / password123
                        <br />
                        <small>Recibe 50% de descuento en Pokeballs</small>
                    </div>

                    <div className="demo-user">
                        <strong>Aspirante a Maestro:</strong> estudiante@duoc.cl / password123
                        <br />
                        <small>Pokémon Inicial de Regalo</small>
                    </div>

                    <div className="demo-user">
                        <strong>Entrenador Regular:</strong> usuario@gmail.com / password123
                        <br />
                        <small>Descuentos aplicables con códigos de Liga</small>
                    </div>
                </div>
            </div>
        </section>
    );
}