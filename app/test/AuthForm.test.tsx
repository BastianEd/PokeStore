import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthForm } from "~/components/molecules/AuthForm";
import { MemoryRouter } from "react-router"; // Necesario porque el componente usa <Link>

// 1. Mockeamos los hooks del contexto y del router
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
        useNavigate: () => mockNavigate,
    };
});

describe("Molecule: AuthForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Modo Login: debería renderizar campos de email y contraseña, pero NO nombre", () => {
        render(
            <MemoryRouter>
                <AuthForm mode="login" />
            </MemoryRouter>
        );

        // Verificamos elementos de UI
        expect(screen.getByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();

        // El campo nombre NO debe existir en modo login
        expect(screen.queryByLabelText(/nombre/i)).not.toBeInTheDocument();

        expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    });

    it("Modo Registro: debería renderizar el campo de nombre", () => {
        render(
            <MemoryRouter>
                <AuthForm mode="register" />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /crear cuenta/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /registrarme/i })).toBeInTheDocument();
    });

    it("Login Exitoso: debería llamar a la función login y redirigir", async () => {
        render(
            <MemoryRouter>
                <AuthForm mode="login" />
            </MemoryRouter>
        );

        // Llenamos el formulario
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "ash@kanto.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "pikachu123" } });

        // Enviamos
        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        // Esperamos a que se resuelva la promesa simulada
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith("ash@kanto.com", "pikachu123");
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("Registro Exitoso: debería llamar a register con nombre, email y password", async () => {
        render(
            <MemoryRouter>
                <AuthForm mode="register" />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: "Ash Ketchum" } });
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "ash@kanto.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "pikachu123" } });

        fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith("Ash Ketchum", "ash@kanto.com", "pikachu123");
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("Manejo de Errores: debería mostrar el mensaje si el login falla", async () => {
        const errorMsg = "Usuario no encontrado";
        // Simulamos que el login falla
        mockLogin.mockRejectedValueOnce(new Error(errorMsg));

        render(
            <MemoryRouter>
                <AuthForm mode="login" />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "fail@test.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "wrongpass" } });
        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        // Verificamos que el error aparezca en pantalla (color rojo en tus estilos)
        await waitFor(() => {
            expect(screen.getByText(errorMsg)).toBeInTheDocument();
        });
    });
});