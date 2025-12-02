import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthPanel } from "~/components/organisms/AuthPanel";
import { MemoryRouter } from "react-router";

// Mocks
const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock("~/services/auth-context", () => ({
    useAuth: () => ({
        login: mockLogin,
        register: mockRegister
    })
}));

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe("Organism: AuthPanel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Modo Login: debería mostrar campos de email y password, pero NO nombre", () => {
        render(
            <MemoryRouter>
                <AuthPanel mode="login" />
            </MemoryRouter>
        );

        expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("entrenador@poke.com")).toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/Ej: Rojo/i)).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    });

    it("Modo Registro: debería mostrar campo de nombre", () => {
        render(
            <MemoryRouter>
                <AuthPanel mode="register" />
            </MemoryRouter>
        );

        expect(screen.getByText("Crear Cuenta")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ej: Rojo/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Obtener Licencia" })).toBeInTheDocument();
    });

    it("Debería validar campos vacíos antes de llamar a la API", async () => {
        render(
            <MemoryRouter>
                <AuthPanel mode="login" />
            </MemoryRouter>
        );

        const btnEntrar = screen.getByRole("button", { name: "Entrar" });

        // CORRECCIÓN 1: Disparamos el submit del formulario directamente para asegurar que el handler se ejecute
        // (Buscamos el formulario padre del botón y lo enviamos)
        fireEvent.submit(btnEntrar.closest("form")!);

        // CORRECCIÓN 2: Usamos Regex (/.../i) para buscar el texto de forma más flexible
        // y findByText para esperar a que aparezca
        expect(await screen.findByText(/correo.*contraseña.*obligatorios/i)).toBeInTheDocument();

        // Asegura que NO se llamó a login (el mock)
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it("Debería llamar a login con los datos correctos", async () => {
        render(
            <MemoryRouter>
                <AuthPanel mode="login" />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("entrenador@poke.com"), { target: { value: "ash@test.com" } });
        fireEvent.change(screen.getByPlaceholderText("********"), { target: { value: "pikachu123" } });

        const btnEntrar = screen.getByRole("button", { name: "Entrar" });

        // Usamos click aquí, o submit también funcionaría
        fireEvent.click(btnEntrar);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith("ash@test.com", "pikachu123");
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });
});