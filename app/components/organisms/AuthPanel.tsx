// app/components/organisms/AuthPanel.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";

type AuthMode = "login" | "register";

type Usuario = {
    nombre: string;
    email: string;
    password: string;
    tipo: "mayor" | "estudiante" | "regular";
};

const STORAGE_KEY = "ms_usuarios";
const CURRENT_USER_KEY = "ms_usuario_actual";

const DEMO_USERS: Usuario[] = [
    {
        nombre: "Usuario Mayor",
        email: "mayor@gmail.com",
        password: "password123",
        tipo: "mayor",
    },
    {
        nombre: "Estudiante Duoc",
        email: "estudiante@duoc.cl",
        password: "password123",
        tipo: "estudiante",
    },
    {
        nombre: "Usuario Regular",
        email: "usuario@gmail.com",
        password: "password123",
        tipo: "regular",
    },
];

function leerUsuarios(): Usuario[] {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as Usuario[];
    } catch {
        return [];
    }
}

function guardarUsuarios(usuarios: Usuario[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

function guardarUsuarioActual(usuario: Usuario) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(usuario));
}

export function AuthPanel({ mode }: { mode: AuthMode }) {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const esLogin = mode === "login";

    // Cargar usuarios demo solo una vez
    useEffect(() => {
        if (typeof window === "undefined") return;
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS));
        }
    }, []);

    const limpiarMensajes = () => {
        setError(null);
        setMessage(null);
    };

    const manejarLogin = () => {
        const usuarios = leerUsuarios();
        const encontrado = usuarios.find(
            (u) => u.email === email.trim() && u.password === password,
        );

        if (!encontrado) {
            setError("Correo o contraseña incorrectos.");
            return;
        }

        guardarUsuarioActual(encontrado);

        let extra = "";
        if (encontrado.tipo === "mayor") {
            extra = " (50% de descuento por edad)";
        } else if (encontrado.tipo === "estudiante") {
            extra = " (torta gratis en cumpleaños)";
        }

        setMessage(`Bienvenido/a, ${encontrado.nombre}${extra}`);
    };

    const manejarRegistro = () => {
        if (!nombre.trim() || !email.trim() || !password.trim()) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        const usuarios = leerUsuarios();
        const yaExiste = usuarios.some(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        );

        if (yaExiste) {
            setError("Ya existe un usuario registrado con ese correo.");
            return;
        }

        const nuevo: Usuario = {
            nombre: nombre.trim(),
            email: email.trim(),
            password,
            tipo: "regular",
        };

        const actualizados = [...usuarios, nuevo];
        guardarUsuarios(actualizados);
        guardarUsuarioActual(nuevo);

        setMessage("Registro exitoso. Sesión iniciada.");
        setNombre("");
        setEmail("");
        setPassword("");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        limpiarMensajes();
        if (esLogin) {
            manejarLogin();
        } else {
            manejarRegistro();
        }
    };

    return (
        <section className="section auth-section">
            <div className="container auth-container">
                <div className="auth-card">
                    <h2>{esLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h2>
                    <p className="auth-subtitle">
                        {esLogin
                            ? "Accede para gestionar tus pedidos y ver tus beneficios."
                            : "Regístrate para recibir descuentos y sorpresas dulces."}
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!esLogin && (
                            <div className="input-group">
                                <label htmlFor="nombre">Nombre completo</label>
                                <input
                                    id="nombre"
                                    type="text"
                                    placeholder="Ej: Nicolás Fonseca"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="tucorreo@ejemplo.cl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="auth-error">{error}</p>}
                        {message && <p className="auth-success">{message}</p>}

                        <button type="submit" className="btn-primary auth-submit-btn">
                            {esLogin ? "Ingresar" : "Registrarme"}
                        </button>
                    </form>

                    <div className="auth-switch">
                        {esLogin ? (
                            <p>
                                ¿No tienes cuenta?{" "}
                                <Link
                                    to="/registro"
                                    className="link-button"
                                    onClick={limpiarMensajes}
                                >
                                    Crear cuenta
                                </Link>
                            </p>
                        ) : (
                            <p>
                                ¿Ya tienes cuenta?{" "}
                                <Link
                                    to="/login"
                                    className="link-button"
                                    onClick={limpiarMensajes}
                                >
                                    Iniciar sesión
                                </Link>
                            </p>
                        )}
                    </div>

                    <div className="demo-users">
                        <h4>👥 Usuarios de Prueba:</h4>

                        <div className="demo-user">
                            <strong>Usuario Mayor:</strong> mayor@gmail.com / password123
                            <br />
                            <small>Recibe 50% descuento por edad</small>
                        </div>

                        <div className="demo-user">
                            <strong>Estudiante Duoc:</strong> estudiante@duoc.cl /
                            password123
                            <br />
                            <small>Torta gratis en cumpleaños</small>
                        </div>

                        <div className="demo-user">
                            <strong>Usuario Regular:</strong> usuario@gmail.com /
                            password123
                            <br />
                            <small>Descuentos aplicables con códigos</small>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
