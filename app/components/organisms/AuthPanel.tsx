import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/services/auth-context";

type AuthMode = "login" | "register";

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