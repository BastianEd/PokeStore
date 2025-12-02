import type { Route } from "./+types/register";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "~/services/auth-context";

/**
 * @description Genera los metadatos para la página de registro.
 *
 * Esta función es utilizada por el framework de enrutamiento para definir las etiquetas `<title>` y `<meta name="description">`
 * en el `<head>` del documento. Es fundamental para el SEO y para mejorar la experiencia del usuario
 * al proporcionar un título claro en la pestaña del navegador.
 *
 * @param {Route.MetaArgs} args - Argumentos proporcionados por el enrutador.
 * @returns {Array<Object>} Un array de objetos que representan las etiquetas meta.
 */
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Registro de Entrenadores - Pokémon Trading Co." },
        {
            name: "description",
            content: "Crea tu cuenta para disfrutar de beneficios exclusivos y comenzar tu viaje Pokémon.",
        },
    ];
}

/**
 * @description Componente que renderiza la página de registro de nuevos usuarios.
 *
 * Este componente presenta un formulario para que los nuevos usuarios creen una cuenta.
 * Se encarga de gestionar el estado de los campos del formulario, las validaciones del lado del cliente
 * (como la confirmación de contraseña), el estado de carga durante el envío y la visualización de errores.
 *
 * Utiliza el hook `useAuth` para acceder a la función `register` y `useNavigate` para redirigir
 * al usuario a la página principal tras un registro exitoso.
 *
 * @returns {React.ReactElement} La página de registro con su formulario y contenido informativo.
 */
export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * @description Manejador para el evento de envío del formulario de registro.
     *
     * Orquesta el proceso de creación de una nueva cuenta. Extrae los datos del formulario,
     * ejecuta validaciones (campos obligatorios, longitud de contraseña, coincidencia de contraseñas),
     * y si son exitosas, invoca la función `register` del contexto de autenticación.
     * Gestiona los estados de carga y error para dar feedback al usuario.
     *
     * @param {React.FormEventHandler<HTMLFormElement>} e - El evento del formulario.
     */
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const nombre = String(formData.get("nombre") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const confirm = String(formData.get("confirm") ?? "");
        // El backend no soporta fecha de nacimiento aún, lo omitimos del envío

        setError(null);

        if (!nombre || !email || !password || !confirm) {
            setError("Por favor completa todos los campos obligatorios.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (password !== confirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);
            // CORRECCIÓN: Pasamos argumentos separados (nombre, email, password)
            await register(nombre, email, password);
            navigate("/", { replace: true });
        } catch (err: any) {
            setError(err?.message ?? "No se pudo registrar el usuario.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="registro" className="section active">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Crear Cuenta de Entrenador</h2>
                    <p className="section-subtitle">
                        Regístrate para acceder a beneficios exclusivos, gestionar tu Pokédex y comenzar a coleccionar.
                    </p>
                </div>

                <div className="form-container">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="reg-nombre">Nombre de Entrenador</label>
                            <input
                                id="reg-nombre"
                                name="nombre"
                                type="text"
                                required
                                placeholder="Ej: Ash Ketchum"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-email">Correo electrónico</label>
                            <input
                                id="reg-email"
                                name="email"
                                type="email"
                                required
                                placeholder="tu@correo.cl"
                            />
                        </div>

                        {/* Campo visual solamente (no se envía al backend por ahora) */}
                        <div className="form-group">
                            <label htmlFor="reg-fecha-nacimiento">
                                Fecha de nacimiento (opcional)
                            </label>
                            <input
                                id="reg-fecha-nacimiento"
                                name="fechaNacimiento"
                                type="date"
                            />
                            <small className="form-help">
                                Nos ayuda a identificar si eres{" "}
                                <strong>Profesor Pokémon</strong> o{" "}
                                <strong>Estudiante Duoc</strong> para aplicar beneficios.
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-password">Contraseña</label>
                            <input
                                id="reg-password"
                                name="password"
                                type="password"
                                required
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-confirm">Confirmar contraseña</label>
                            <input
                                id="reg-confirm"
                                name="confirm"
                                type="password"
                                required
                                placeholder="Repite la contraseña"
                            />
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <button
                            type="submit"
                            className="btn-primary full-width"
                            disabled={loading}
                        >
                            {loading ? "Creando cuenta..." : "Crear Cuenta de Entrenador"}
                        </button>

                        <div className="form-footer">
                            <p>
                                ¿Ya tienes cuenta?{" "}
                                <Link to="/login" className="link">
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </form>

                    <aside className="auth-benefits">
                        <h3>Rangos de Entrenador y Beneficios</h3>
                        <ul>
                            <li>🧓 <strong>Profesor Pokémon:</strong> 50% de descuento en Pokeballs.</li>
                            <li>
                                🎓 <strong>Aspirante a Maestro:</strong> Pokémon Inicial de Regalo.
                            </li>
                            <li>
                                😊 <strong>Entrenador Regular:</strong> Descuentos con códigos y
                                promociones de Liga.
                            </li>
                        </ul>
                    </aside>
                </div>
            </div>
        </section>
    );
}