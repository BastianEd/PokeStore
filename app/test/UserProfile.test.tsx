import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { UserProfile } from "~/components/molecules/UserProfile";

// Definimos la clave exacta que usa el componente internamente
const STORAGE_KEY = "usuario_actual_mil_sabores";

describe("Molecule: UserProfile", () => {
    beforeEach(() => {
        window.localStorage.clear();

        // Mockeamos window.location para poder probar la redirección
        // Usamos defineProperty porque location es read-only en jsdom
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: '' }
        });
    });

    it("no debería renderizar nada si no hay usuario", () => {
        const { container } = render(<UserProfile />);
        expect(container).toBeEmptyDOMElement();
    });

    it("debería renderizar la información del usuario si está logueado", () => {
        // Usamos la clave correcta: "usuario_actual_mil_sabores"
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ email: "ash@kanto.com", tipo: "mayor" })
        );

        // Disparamos el evento para que el hook useCurrentUser actualice el estado
        window.dispatchEvent(new Event("usuario_actual_pokestore_changed"));

        render(<UserProfile />);

        expect(screen.getByText("ash@kanto.com")).toBeInTheDocument();
        expect(screen.getByText(/usuario mayor/i)).toBeInTheDocument();
    });

    it("debería cerrar sesión al hacer click en el botón", () => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ email: "ash@kanto.com", tipo: "regular" })
        );
        window.dispatchEvent(new Event("usuario_actual_pokestore_changed"));

        render(<UserProfile />);

        const btnLogout = screen.getByText(/cerrar sesión/i);
        fireEvent.click(btnLogout);

        // Verifica que se eliminó la clave correcta
        expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
        expect(window.location.href).toContain("/login");
    });
});