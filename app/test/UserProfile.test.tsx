import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserProfile } from "~/components/molecules/UserProfile";

// Mocks
const mockLogout = vi.fn();
const mockNavigate = vi.fn();

// Mockear useAuth para controlar el usuario logueado en cada test
vi.mock("~/services/auth-context", () => ({
    useAuth: vi.fn()
}));

// Mockear react-router para useNavigate
vi.mock("react-router", () => ({
    useNavigate: () => mockNavigate
}));

import { useAuth } from "~/services/auth-context";

describe("Molecule: UserProfile", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("no debería renderizar nada si no hay usuario (retorna null)", () => {
        // Simulamos que no hay usuario
        (useAuth as any).mockReturnValue({ usuarioActual: null, logout: mockLogout });

        const { container } = render(<UserProfile />);
        expect(container).toBeEmptyDOMElement();
    });

    it("debería mostrar el nombre y rol del usuario (Admin)", () => {
        (useAuth as any).mockReturnValue({
            usuarioActual: {
                id: 1,
                nombre: "Ash Ketchum",
                email: "ash@kanto.com",
                roles: ["admin"]
            },
            logout: mockLogout
        });

        render(<UserProfile />);

        expect(screen.getByText("Ash Ketchum")).toBeInTheDocument();
        expect(screen.getByText("ash@kanto.com")).toBeInTheDocument();
        expect(screen.getByText(/profesor pokémon/i)).toBeInTheDocument();
    });

    it("debería llamar a logout y redirigir al hacer click en Salir", () => {
        (useAuth as any).mockReturnValue({
            usuarioActual: { id: 2, nombre: "Misty", roles: ["user"] },
            logout: mockLogout
        });

        render(<UserProfile />);

        const btnSalir = screen.getByText("Salir");
        fireEvent.click(btnSalir);

        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});