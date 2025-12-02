import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductCard } from "~/components/molecules/ProductCard";
import type { Pokemon } from "~/data/products";

// 1. Mockeamos los hooks que usa el componente
const mockAddToCart = vi.fn();
const mockShowNotification = vi.fn();

vi.mock("~/services/cart-context", () => ({
    useCart: () => ({
        addToCart: mockAddToCart
    })
}));

vi.mock("~/services/notification-context", () => ({
    useNotification: () => ({
        showNotification: mockShowNotification
    })
}));

// Datos de prueba
const mockPokemon: Pokemon = {
    pokedexId: 25,
    nombre: "Pikachu",
    tipoPrincipal: "Eléctrico",
    precio: 5000,
    descripcion: "Ratón eléctrico",
    imagen: "pikachu.png"
};

describe("Molecule: ProductCard", () => {
    it("debería renderizar la información del Pokémon", () => {
        render(<ProductCard pokemon={mockPokemon} onView={() => {}} />);

        expect(screen.getByText("Pikachu")).toBeInTheDocument();
        // Usamos una expresión regular flexible para el precio por el formato de moneda
        expect(screen.getByText(/5.000/)).toBeInTheDocument();
    });

    it("debería llamar a addToCart y showNotification al hacer click en Capturar", () => {
        render(<ProductCard pokemon={mockPokemon} onView={() => {}} />);

        const btnCapturar = screen.getByRole("button", { name: /capturar/i });
        fireEvent.click(btnCapturar);

        expect(mockAddToCart).toHaveBeenCalledWith(mockPokemon);
        expect(mockShowNotification).toHaveBeenCalled();
    });

    it("debería llamar a onView al hacer click en el ojo (Ver ficha)", () => {
        const handleView = vi.fn();
        render(<ProductCard pokemon={mockPokemon} onView={handleView} />);

        const btnVer = screen.getByTitle("Ver ficha Pokémon");
        fireEvent.click(btnVer);

        expect(handleView).toHaveBeenCalledWith(mockPokemon);
    });
});