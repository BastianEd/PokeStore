import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "~/components/atoms/Input";

describe("Atom: Input", () => {
    it("debería renderizar con el placeholder correcto", () => {
        render(<Input placeholder="Nombre del Pokémon" />);
        expect(screen.getByPlaceholderText("Nombre del Pokémon")).toBeInTheDocument();
    });

    it("debería capturar el cambio de valor", () => {
        const handleChange = vi.fn();
        render(<Input onChange={handleChange} placeholder="test" />);

        const input = screen.getByPlaceholderText("test");
        fireEvent.change(input, { target: { value: 'Pikachu' } });

        expect(handleChange).toHaveBeenCalled();
        expect(input).toHaveValue('Pikachu');
    });
});