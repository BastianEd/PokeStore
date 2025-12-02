import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/services/auth-context";

/**
 * @interface AuthFormProps
 * @description Define las propiedades para el componente `AuthForm`.
 * @property {"login" | "register"} mode - Determina si el formulario se renderiza para iniciar sesión o para registrar un nuevo usuario.
 */
interface AuthFormProps {
    mode: "login" | "register";
}

/**
 * @description Componente de formulario para autenticación de usuarios, con modos para "login" y "register".
 *
 * Este componente gestiona el estado de los campos del formulario (nombre, email, contraseña),
 * el estado de carga durante la sumisión, y la visualización de errores. Utiliza el hook `useAuth`
 * para acceder a las funciones de `login` y `register`, encapsulando la lógica de autenticación.
 *
 * El formulario se adapta dinámicamente según el `mode` proporcionado:
 * - En modo "login", muestra campos para email y contraseña.
 * - En modo "register", añade un campo para el nombre.
 *
 * Tras una operación exitosa, redirige al usuario a la página principal.
 *
 * @param {AuthFormProps} props - Propiedades del componente, principalmente el `mode`.
 * @returns {React.ReactElement} Un formulario de autenticación interactivo.
 */
export function AuthForm({ mode }: AuthFormProps) {
    const navigate = useNavigate();
    const { login, register } = useAuth(); // <--- Accedemos a las funciones reales
    const isLogin = mode === "login";

    const [nombre, setNombre] = useState(""); // Nuevo campo para registro
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * @description Maneja el envío del formulario.
     * Previene el comportamiento por defecto, gestiona el estado de carga,
     * invoca la función de `login` o `register` según el modo,
     * y maneja los errores de la operación.
     * @param {FormEvent<HTMLFormElement>} event - El evento del formulario.
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                navigate("/"); // Redirigir al home
            } else {
                await register(nombre, email, password);
                navigate("/");
            }
        } catch (err: any) {
            // Mostramos el mensaje que viene del servicio/backend
            setError(err.message);
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

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <label className="form-field">
                                <span>Nombre</span>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    placeholder="Tu nombre"
                                />
                            </label>
                        )}

                        <label className="form-field">
                            <span>Correo electrónico</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        <label className="form-field">
                            <span>Contraseña</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>

                        {error && <p className="form-error" style={{color: 'red'}}>{error}</p>}

                        <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                            {loading ? "Cargando..." : (isLogin ? "Entrar" : "Registrarme")}
                        </button>
                        <div className="auth-switch">
                            {isLogin ? (
                                    <span>
                                      ¿No tienes cuenta?{" "}
                                                        <Link to="/registro" className="auth-link">
                                        Crear una cuenta
                                      </Link>
                                    </span>
                                ) : (
                                    <span>
                                      ¿Ya tienes cuenta?{" "}
                                                        <Link to="/login" className="auth-link">
                                        Inicia sesión
                                      </Link>
                                    </span>
                                )
                            }
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
