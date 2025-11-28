import type { Route } from "./+types/forgot-password";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Recuperar contraseña - PokeStore" },
        {
            name: "description",
            content: "Recupera el acceso a tu cuenta de PokeStore.",
        },
    ];
}

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    // Eliminamos la lógica de cambiar password localmente porque ya usamos API
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email) {
            setError("Por favor ingresa tu correo.");
            return;
        }

        setLoading(true);

        // SIMULACIÓN: Como el backend aún no tiene endpoint de recuperación,
        // simulamos el envío de un correo.
        setTimeout(() => {
            setLoading(false);
            setSuccess("Si el correo existe, recibirás un Pidgey mensajero con las instrucciones.");
            setEmail("");

            // Redirigir al login después de unos segundos
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }, 1500);
    };

    return (
        <section className="section active">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Recuperar contraseña</h2>
                    <p className="section-subtitle">
                        Ingresa tu correo registrado y te enviaremos instrucciones.
                    </p>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="ejemplo@correo.cl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}
                        {success && <p className="success-message" style={{textAlign: 'center', marginBottom: '1rem', color: 'green'}}>{success}</p>}

                        <button type="submit" className="btn-primary full-width" disabled={loading}>
                            {loading ? "Enviando..." : "Enviar instrucciones"}
                        </button>

                        <div className="form-footer">
                            <p className="form-help">
                                ¿Recordaste tu contraseña?{" "}
                                <Link to="/login" className="link">Volver a iniciar sesión</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}