// app/routes/forgot-password.tsx
import type { Route } from "./+types/forgot-password";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

type StoredUser = {
    id: string;
    email: string;
    name: string;
    role: "mayor" | "estudiante" | "regular";
    password: string;
};

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Recuperar contraseña - Pastelería Mil Sabores" },
        {
            name: "description",
            content: "Recupera el acceso a tu cuenta de Pastelería Mil Sabores.",
        },
    ];
}

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email || !newPassword || !confirm) {
            setError("Por favor completa todos los campos.");
            return;
        }

        if (newPassword.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (newPassword !== confirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        const raw = window.localStorage.getItem("auth_users");
        const users: StoredUser[] = raw ? JSON.parse(raw) : [];

        const idx = users.findIndex((u) => u.email === email.trim());
        if (idx === -1) {
            setError("No existe ningún usuario registrado con ese correo.");
            return;
        }

        users[idx] = { ...users[idx], password: newPassword };
        window.localStorage.setItem("auth_users", JSON.stringify(users));

        setSuccess("Contraseña actualizada correctamente. Ahora puedes iniciar sesión.");
        setEmail("");
        setNewPassword("");
        setConfirm("");

        setTimeout(() => {
            navigate("/login");
        }, 1200);
    };

    return (
        <section className="auth-section">
            <div className="container auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Recuperar contraseña</h2>
                    <p className="auth-subtitle">
                        Ingresa tu correo y define una nueva contraseña para tu cuenta.
                    </p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="ejemplo@correo.cl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-password">Nueva contraseña</label>
                            <input
                                id="new-password"
                                type="password"
                                className="form-input"
                                placeholder="Ingresa una nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirmar contraseña</label>
                            <input
                                id="confirm-password"
                                type="password"
                                className="form-input"
                                placeholder="Repite la nueva contraseña"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}
                        {success && <p className="form-success">{success}</p>}

                        <button type="submit" className="btn-primary auth-submit">
                            Actualizar contraseña
                        </button>

                        <p className="form-help">
                            ¿Recordaste tu contraseña?{" "}
                            <Link to="/login">Volver a iniciar sesión</Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}
