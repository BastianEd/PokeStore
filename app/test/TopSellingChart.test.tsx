import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TopSellingChart } from "~/components/molecules/TopSellingChart";
import type { SaleRecord } from "~/services/sales.service";

// Datos Mock para las pruebas
// Tenemos 3 Pokémons diferentes en total:
// - Squirtle: 10 unidades (debe ser #1)
// - Bulbasaur: 2 + 3 = 5 unidades (debe ser #2)
// - Charmander: 1 unidad (debe ser #3)
const mockSales: SaleRecord[] = [
    {
        id: 101,
        fecha: "2023-01-01",
        userId: "user1",
        items: [
            // CORRECCIÓN: Usamos 'precio' en lugar de 'price'
            { pokedexId: 1, nombre: "Bulbasaur", quantity: 2, precio: 100, imagen: "img1.png" },
            { pokedexId: 4, nombre: "Charmander", quantity: 1, precio: 100, imagen: "img4.png" }
        ]
    },
    {
        id: 102,
        fecha: "2023-01-02",
        userId: "user2",
        items: [
            { pokedexId: 1, nombre: "Bulbasaur", quantity: 3, precio: 100, imagen: "img1.png" },
            { pokedexId: 7, nombre: "Squirtle", quantity: 10, precio: 100, imagen: "img7.png" }
        ]
    }
];

describe("Molecule: TopSellingChart", () => {
    it("debería mostrar mensaje vacío si no hay ventas", () => {
        render(<TopSellingChart sales={[]} />);
        expect(screen.getByText(/aún no hay datos de ventas/i)).toBeInTheDocument();
    });

    it("debería agregar cantidades y ordenar por los más vendidos", () => {
        render(<TopSellingChart sales={mockSales} />);

        // Squirtle debe tener 10u
        expect(screen.getByText("Squirtle")).toBeInTheDocument();
        expect(screen.getByText("10u")).toBeInTheDocument();

        // Bulbasaur debe tener 5u (2 de la venta 101 + 3 de la venta 102)
        expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
        expect(screen.getByText("5u")).toBeInTheDocument();
    });

    it("debería respetar el prop 'top' limitando la lista", () => {
        // Hay 3 tipos de Pokémon en el mock. Si pedimos top=2, el que menos vendió (Charmander) no debería aparecer.
        render(<TopSellingChart sales={mockSales} top={2} />);

        expect(screen.getByText("Squirtle")).toBeInTheDocument(); // #1
        expect(screen.getByText("Bulbasaur")).toBeInTheDocument(); // #2

        // Charmander (#3) no debería estar en el documento
        expect(screen.queryByText("Charmander")).not.toBeInTheDocument();
    });

    it("no debería renderizar etiquetas <img> si showImages es false", () => {
        render(<TopSellingChart sales={mockSales} showImages={false} />);

        // En este componente, las únicas etiquetas <img /> son las de los iconos de los pokémon.
        const images = screen.queryAllByRole("img");
        expect(images).toHaveLength(0);
    });

    it("debería renderizar imágenes si showImages es true (por defecto)", () => {
        render(<TopSellingChart sales={mockSales} />); // showImages defaults to true

        // Debería haber 3 imágenes correspondientes a los 3 pokémon listados
        const images = screen.getAllByRole("img");
        expect(images.length).toBeGreaterThan(0);
        expect(images[0]).toHaveAttribute("src", "img7.png"); // El primero debe ser Squirtle (el más vendido)
    });
});