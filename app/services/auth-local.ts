// app/services/auth-local.ts

// Usuario guardado localmente
export interface LocalUser {
    id: number;
    nombre: string;
    email: string;
    password: string; // SOLO demo local, en producción debería ir hasheado
}

const USERS_KEY = "mil-sabores-users";
const SESSION_KEY = "mil-sabores-current-user";

function isBrowser() {
    return typeof window !== "undefined";
}

// 👇 Usuarios de DEMO que se siembran la primera vez
const DEMO_USERS: LocalUser[] = [
    {
        id: 1,
        nombre: "Usuario Mayor",
        email: "mayor@gmail.com",
        password: "password123",
    },
    {
        id: 2,
        nombre: "Estudiante Duoc",
        email: "estudiante@duoc.cl",
        password: "password123",
    },
    {
        id: 3,
        nombre: "Usuario Regular",
        email: "usuario@gmail.com",
        password: "password123",
    },
];

function seedDemoUsers(): LocalUser[] {
    if (!isBrowser()) return [];
    // Guardamos los demo solo si no había nada
    window.localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS));
    return DEMO_USERS;
}

function loadUsers(): LocalUser[] {
    if (!isBrowser()) return [];
    try {
        const raw = window.localStorage.getItem(USERS_KEY);

        // Si no hay usuarios aún, sembramos los de demo
        if (!raw) {
            return seedDemoUsers();
        }

        const parsed = JSON.parse(raw) as LocalUser[];

        // Si por alguna razón está vacío, también sembramos
        if (!parsed || parsed.length === 0) {
            return seedDemoUsers();
        }

        return parsed;
    } catch {
        // Si algo falla, dejamos al menos los demo
        return seedDemoUsers();
    }
}

function saveUsers(users: LocalUser[]) {
    if (!isBrowser()) return;
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(user: LocalUser) {
    if (!isBrowser()) return;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getCurrentUser(): LocalUser | null {
    if (!isBrowser()) return null;
    try {
        const raw = window.localStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as LocalUser) : null;
    } catch {
        return null;
    }
}

export function logoutLocalUser() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(SESSION_KEY);
}

export interface RegisterDto {
    nombre: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

// REGISTRO LOCAL
export async function registerLocalUser(data: RegisterDto): Promise<LocalUser> {
    const users = loadUsers();

    const exists = users.some((u) => u.email === data.email);
    if (exists) {
        throw new Error("Ya existe un usuario registrado con ese correo.");
    }

    const newUser: LocalUser = {
        id: Date.now(),
        nombre: data.nombre,
        email: data.email,
        password: data.password,
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    saveSession(newUser);

    return newUser;
}

// LOGIN LOCAL
export async function loginLocalUser(data: LoginDto): Promise<LocalUser> {
    const users = loadUsers();

    const user = users.find(
        (u) => u.email === data.email && u.password === data.password,
    );

    if (!user) {
        throw new Error("Correo o contraseña incorrectos.");
    }

    saveSession(user);
    return user;
}
