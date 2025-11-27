import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthForm } from "~/components/molecules/AuthForm";
import { MemoryRouter } from "react-router";

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Molecule: AuthForm", () => {
    beforeEach(() => {
        window.localStorage.clear();
        mockNavigate.mockReset();
    });

    it("debería permitir iniciar sesión con credenciales correctas (simuladas)", () => {
        // Pre-popular un usuario en localStorage para que el login funcione
        const mockUser = { email: "test@poke.com", password: "123", tipo: "regular" };
        window.localStorage.setItem("usuarios_pokestore", JSON.stringify([mockUser]));

        render(
            <MemoryRouter>
                <AuthForm mode="login" />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "test@poke.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "123" } });

        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        expect(screen.getByText(/inicio de sesión exitoso/i)).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("debería mostrar error con credenciales incorrectas", () => {
        render(
            <MemoryRouter>
                <AuthForm mode="login" />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "wrong@poke.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "wrong" } });

        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        expect(screen.getByText(/correo o contraseña incorrectos/i)).toBeInTheDocument();
    });

    it("debería registrar un nuevo usuario correctamente", () => {
        render(
            <MemoryRouter>
                <AuthForm mode="register" />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "new@poke.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "123456" } });

        fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

        expect(screen.getByText(/registro exitoso/i)).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith("/");

        // Verificar que se guardó en localStorage
        const stored = JSON.parse(window.localStorage.getItem("usuarios_pokestore") || "[]");
        expect(stored).toHaveLength(1);
        expect(stored[0].email).toBe("new@poke.com");
    });
});