import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/services/auth-context";

/**
 * @description Define los modos de operación para el panel de autenticación.
 * Puede ser 'login' para iniciar sesión o 'register' para crear una nueva cuenta.
 */
type AuthMode = "login" | "register";

/**
 * @description Componente de panel de autenticación que maneja tanto el inicio de sesión como el registro de usuarios.
 *
 * Este componente es un "organismo" que encapsula toda la lógica y la interfaz de usuario para la autenticación.
 * Se adapta dinámicamente según el `mode` proporcionado, mostrando los campos y textos apropiados
 * para cada caso.
 *
 * Gestiona el estado interno del formulario, la comunicación con el servicio de autenticación (`useAuth`),
 * y proporciona feedback al usuario a través de mensajes de estado (error, éxito, carga).
 *
 * @param {{ mode: AuthMode }} props - Las propiedades del componente, donde `mode` determina su comportamiento.
 * @returns {React.ReactElement} Un panel de autenticación completo y funcional.
 */
export function AuthPanel({ mode }: { mode: AuthMode }) {
    const { login, register } = useAuth(); // Usamos las funciones reales del contexto
    const navigate = useNavigate();

    // Estados del formulario
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados de UI
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isLogin = mode === "login";

    /**
     * @description Maneja el envío del formulario de autenticación.
     *
     * Esta función asíncrona se encarga de:
     * 1. Prevenir el comportamiento por defecto del formulario.
     * 2. Realizar validaciones básicas en los campos.
     * 3. Invocar la función `login` o `register` del contexto de autenticación, según el `mode`.
     * 4. Gestionar el estado de carga (`loading`) para dar feedback visual.
     * 5. Capturar y mostrar errores provenientes de la capa de servicio.
     * 6. En caso de éxito, mostrar un mensaje y redirigir al usuario.
     *
     * @param {FormEvent<HTMLFormElement>} event - El evento de envío del formulario.
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        // Validaciones básicas
        if (!email.trim() || !password.trim()) {
            setError("El correo y la contraseña son obligatorios.");
            setLoading(false);
            return;
        }

        if (!isLogin && !nombre.trim()) {
            setError("Por favor, ingresa tu nombre de entrenador.");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await login(email, password);
                // Si el login no lanza error, redirigimos
                navigate("/");
            } else {
                // Registro: Enviamos nombre, email y password a la API
                await register(nombre, email, password);
                setSuccessMessage("¡Cuenta creada con éxito! Entrando al mundo Pokémon...");
                // Pequeña pausa para leer el mensaje antes de redirigir
                setTimeout(() => navigate("/"), 1500);
            }
        } catch (err: any) {
            // Mostramos el error que viene del auth-context (que a su vez viene de la API)
            setError(err.message || "Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section active auth-section">
            <div className="container auth-layout">
                <div className="auth-card">
                    <h2 className="section-title">
                        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                    </h2>
                    <p className="section-subtitle" style={{ textAlign: "center", marginBottom: "1.5rem", color: "#666" }}>
                        {isLogin
                            ? "Accede a tu PC para gestionar tus Pokémon."
                            : "Regístrate para obtener tu Licencia de Entrenador."}
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Campo Nombre: Solo visible en Registro */}
                        {!isLogin && (
                            <label className="form-field">
                                <span>Nombre de Entrenador</span>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    placeholder="Ej: Rojo, Azul, Ash..."
                                />
                            </label>
                        )}

                        <label className="form-field">
                            <span>Correo electrónico</span>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="entrenador@poke.com"
                            />
                        </label>

                        <label className="form-field">
                            <span>Contraseña</span>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="********"
                            />
                        </label>

                        {/* Mensajes de Feedback */}
                        {error && (
                            <p className="form-error" style={{ color: "#e74c3c", textAlign: "center", fontWeight: "bold" }}>
                                {error}
                            </p>
                        )}
                        {successMessage && (
                            <p className="form-success" style={{ color: "#27ae60", textAlign: "center", fontWeight: "bold" }}>
                                {successMessage}
                            </p>
                        )}

                        <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                            {loading
                                ? (isLogin ? "Ingresando..." : "Registrando...")
                                : (isLogin ? "Entrar" : "Obtener Licencia")
                            }
                        </button>

                        <div className="auth-switch">
                            {isLogin ? (
                                <span>
                                    ¿No tienes cuenta?{" "}
                                    <Link to="/registro" className="auth-link" onClick={() => { setError(null); }}>
                                        Crear una cuenta
                                    </Link>
                                </span>
                            ) : (
                                <span>
                                    ¿Ya tienes cuenta?{" "}
                                    <Link to="/login" className="auth-link" onClick={() => { setError(null); }}>
                                        Inicia sesión
                                    </Link>
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}