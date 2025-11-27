import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductModal } from "~/components/organisms/ProductModal";
import type { Pokemon } from "~/data/products";

// Mocks de contexto
const mockAddToCart = vi.fn();
const mockShowNotification = vi.fn();

vi.mock("~/services/cart-context", () => ({
    useCart: () => ({ addToCart: mockAddToCart })
}));

vi.mock("~/services/notification-context", () => ({
    useNotification: () => ({ showNotification: mockShowNotification })
}));

const mockPokemon: Pokemon = {
    pokedexId: 6,
    nombre: "Charizard",
    tipoPrincipal: "Fuego",
    precio: 95000,
    descripcion: "Dragón escupe fuego",
    imagen: "charizard.png"
};

describe("Organism: ProductModal", () => {
    it("no debería renderizar nada si isOpen es false", () => {
        const { container } = render(
            <ProductModal isOpen={false} onClose={() => {}} pokemon={mockPokemon} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("debería renderizar el contenido del Pokémon cuando está abierto", () => {
        render(
            <ProductModal isOpen={true} onClose={() => {}} pokemon={mockPokemon} />
        );

        expect(screen.getByRole("heading", { name: "Charizard" })).toBeInTheDocument();
        expect(screen.getByText(/Dragón escupe fuego/)).toBeInTheDocument();
        expect(screen.getByText(/95.000/)).toBeInTheDocument(); // Verifica formato de precio
    });

    it("debería llamar a addToCart al capturar", () => {
        render(
            <ProductModal isOpen={true} onClose={() => {}} pokemon={mockPokemon} />
        );

        fireEvent.click(screen.getByText(/capturar pokémon/i));

        expect(mockAddToCart).toHaveBeenCalledWith(mockPokemon);
        expect(mockShowNotification).toHaveBeenCalled();
    });

    it("debería llamar a onClose al cerrar", () => {
        const handleClose = vi.fn();
        render(
            <ProductModal isOpen={true} onClose={handleClose} pokemon={mockPokemon} />
        );

        // El botón de cerrar suele ser el primero o tener clase específica
        // En tu código tiene un icono fa-times. Buscamos el botón contenedor.
        const closeButtons = screen.getAllByRole("button");
        // El primer botón en el DOM del modal suele ser el de cerrar (top-right)
        fireEvent.click(closeButtons[0]);

        expect(handleClose).toHaveBeenCalled();
    });
});