import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductModal } from "~/components/organisms/ProductModal";
import type { Pokemon } from "~/data/products";

const mockAddToCart = vi.fn();
const mockShowNotification = vi.fn();

vi.mock("~/services/cart-context", () => ({
    useCart: () => ({ addToCart: mockAddToCart })
}));

vi.mock("~/services/notification-context", () => ({
    useNotification: () => ({ showNotification: mockShowNotification })
}));

const mockPokemon: Pokemon = {
    pokedexId: 150,
    nombre: "Mewtwo",
    tipoPrincipal: "Psíquico",
    precio: 150000,
    descripcion: "Creado por ingeniería genética.",
    imagen: "mewtwo.png"
};

describe("Organism: ProductModal", () => {
    it("no debería renderizar nada si isOpen es false", () => {
        const { container } = render(
            <ProductModal isOpen={false} onClose={() => {}} pokemon={mockPokemon} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("debería renderizar el modal si isOpen es true", () => {
        render(
            <ProductModal isOpen={true} onClose={() => {}} pokemon={mockPokemon} />
        );
        expect(screen.getByText("Mewtwo")).toBeInTheDocument();
        expect(screen.getByText(/ingeniería genética/i)).toBeInTheDocument();
    });

    it("debería llamar a addToCart al pulsar 'Capturar Pokémon'", () => {
        render(
            <ProductModal isOpen={true} onClose={() => {}} pokemon={mockPokemon} />
        );

        fireEvent.click(screen.getByText(/capturar pokémon/i));

        expect(mockAddToCart).toHaveBeenCalledWith(mockPokemon);
        expect(mockShowNotification).toHaveBeenCalled();
    });

    it("debería llamar a onClose al pulsar el botón de cerrar", () => {
        const handleClose = vi.fn();
        render(
            <ProductModal isOpen={true} onClose={handleClose} pokemon={mockPokemon} />
        );

        // El botón de cerrar tiene la clase modal-close-btn o el icono fa-times
        // Buscamos por el botón
        const buttons = screen.getAllByRole("button");
        // Asumiendo que el de cerrar es el primero en el DOM del modal (top-right)
        fireEvent.click(buttons[0]);

        expect(handleClose).toHaveBeenCalled();
    });
});