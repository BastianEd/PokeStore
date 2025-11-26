// app/components/molecules/AuthForm.tsx
import {
    useEffect,
    useState,
    type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router";

type UsuarioTipo = "regular";

type Usuario = {
    email: string;
    password: string;
    tipo: UsuarioTipo;
};

const STORAGE_KEY = "usuarios_pokestore";
const CURRENT_KEY = "usuario_actual_pokestore";

const DEMO_USERS: Usuario[] = [
    { email: "usuario@gmail.com", password: "password123", tipo: "regular" },
];

// --- helpers de localStorage ---

function leerUsuarios(): Usuario[] {
    if (typeof window === "undefined") return DEMO_USERS;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        // si no hay nada, inicializamos con los demos
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS));
        return DEMO_USERS;
    }

    try {
        const guardados = JSON.parse(raw) as Usuario[];

        // nos aseguramos de que los demo estén presentes
        const mezclados = [...guardados];
        for (const demo of DEMO_USERS) {
            if (!mezclados.some((u) => u.email === demo.email)) {
                mezclados.push(demo);
            }
        }

        if (mezclados.length !== guardados.length) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mezclados));
        }

        return mezclados;
    } catch {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS));
        return DEMO_USERS;
    }
}

function guardarUsuarios(usuarios: Usuario[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

interface AuthFormProps {
    mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
    const navigate = useNavigate();
    const isLogin = mode === "login";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tipo, setTipo] = useState<UsuarioTipo>("regular");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Asegura que existan los usuarios demo
    useEffect(() => {
        leerUsuarios();
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (typeof window === "undefined") return;

        if (isLogin) {
            // ---- LOGIN ----
            const usuarios = leerUsuarios();
            const usuario = usuarios.find(
                (u) => u.email === email && u.password === password,
            );

            if (!usuario) {
                setError("Correo o contraseña incorrectos");
                return;
            }

            window.localStorage.setItem(
                CURRENT_KEY,
                JSON.stringify({ email: usuario.email, tipo: usuario.tipo }),
            );
            // avisar al header que cambió el usuario
            window.dispatchEvent(new Event("usuario_actual_pokestore_changed"));

            setSuccess("Inicio de sesión exitoso 😎");

            navigate("/");
        } else {
            // ---- REGISTRO ----
            if (!email || !password) {
                setError("Completa todos los campos");
                return;
            }

            let usuarios = leerUsuarios();

            if (usuarios.some((u) => u.email === email)) {
                setError("Ya existe un usuario con ese correo");
                return;
            }

            const nuevo: Usuario = { email, password, tipo };
            usuarios = [...usuarios, nuevo];
            guardarUsuarios(usuarios);

            // lo dejamos logeado inmediatamente
            window.localStorage.setItem(
                CURRENT_KEY,
                JSON.stringify({ email: nuevo.email, tipo: nuevo.tipo }),
            );
            window.dispatchEvent(new Event("usuario_actual_pokestore_changed"));

            setSuccess("Registro exitoso. Te hemos iniciado sesión automáticamente 🎉");
            navigate("/");
        }
    };

    return (
        <section className="section active auth-section">
            <div className="container auth-layout">
                {/* Panel principal */}
                <div className="auth-card">
                    <h2 className="section-title">
                        {isLogin ? "Iniciar Sesión - PokeStore" : "Registro - PokeStore"}
                    </h2>
                    <p className="auth-subtitle">
                        {isLogin
                            ? "Ingresa con tu correo y contraseña para acceder a tu cuenta."
                            : "Crea tu cuenta para comenzar a comprar en PokeStore."}
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label className="form-field">
                            <span>Correo electrónico</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ej: usuario@gmail.com"
                            />
                        </label>

                        <label className="form-field">
                            <span>Contraseña</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </label>


                        {error && <p className="form-error">{error}</p>}
                        {success && <p className="form-success">{success}</p>}

                        <button type="submit" className="btn-primary auth-submit-btn">
                            {isLogin ? "Entrar" : "Registrarme"}
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
                            )}
                        </div>
                    </form>
                </div>

            </div>
        </section>
    );
}
