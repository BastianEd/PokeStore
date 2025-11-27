import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { AuthPanel } from "~/components/organisms/AuthPanel";
import { MemoryRouter } from "react-router";

describe("Organism: AuthPanel", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("debería permitir cambiar entre campos de login y registro", () => {
        // Modo Registro: debe tener campo Nombre
        const { unmount } = render(
            <MemoryRouter>
                <AuthPanel mode="register" />
            </MemoryRouter>
        );
        expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
        unmount();

        // Modo Login: NO debe tener campo Nombre
        render(
            <MemoryRouter>
                <AuthPanel mode="login" />
            </MemoryRouter>
        );
        expect(screen.queryByLabelText(/nombre completo/i)).not.toBeInTheDocument();
    });

    it("debería validar campos vacíos", () => {
        render(
            <MemoryRouter>
                <AuthPanel mode="register" />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));
        expect(screen.getByText(/todos los campos son obligatorios/i)).toBeInTheDocument();
    });
});