import type { Route } from "./+types/login";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "~/services/auth-context";

/**
 * @description Genera los metadatos para la página de login.
 *
 * Esta función es utilizada por el framework de enrutamiento para establecer las etiquetas `<title>` y `<meta name="description">`
 * en el `<head>` del documento HTML. Esto es crucial para el SEO y para proporcionar contexto al usuario
 * en la pestaña del navegador.
 *
 * @param {Route.MetaArgs} args - Argumentos proporcionados por el enrutador, que pueden incluir datos del cargador, parámetros, etc.
 * @returns {Array<Object>} Un array de objetos de metadatos.
 */
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Acceso de Entrenadores - Pokémon Trading Co." },
        {
            name: "description",
            content: "Inicia sesión para gestionar tu Pokédex de pedidos y beneficios.",
        },
    ];
}

/**
 * @description Componente que renderiza la página de inicio de sesión.
 *
 * Este componente presenta un formulario para que los usuarios se autentiquen.
 * Gestiona el estado del formulario, incluyendo la entrada del usuario, el estado de carga
 * durante la sumisión y la visualización de mensajes de error.
 *
 * Utiliza el `useAuth` hook para acceder a la lógica de autenticación y `useNavigate`
 * para redirigir al usuario a la página principal después de un inicio de sesión exitoso.
 *
 * @returns {React.ReactElement} La página de login con su formulario y elementos de UI adicionales.
 */
export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * @description Manejador para el evento de envío del formulario de login.
     *
     * Orquesta el proceso de autenticación del usuario. Extrae las credenciales del
     * evento del formulario, realiza una validación básica, y luego invoca la función `login`
     * del contexto de autenticación. Gestiona los estados de carga y error para proporcionar
     * feedback visual al usuario. En caso de éxito, redirige al usuario a la ruta raíz.
     *
     * @param {React.FormEventHandler<HTMLFormElement>} e - El evento del formulario.
     */
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
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
            await login(email, password);
            navigate("/", { replace: true });
        } catch (err: any) {
            // Mostramos el mensaje de error que viene del auth-context/API
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
            </div>
        </section>
    );
}