import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/services/auth-context";

interface AuthFormProps {
    mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
    const navigate = useNavigate();
    const { login, register } = useAuth(); // <--- Accedemos a las funciones reales
    const isLogin = mode === "login";

    const [nombre, setNombre] = useState(""); // Nuevo campo para registro
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
