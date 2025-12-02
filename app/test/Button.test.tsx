import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "~/components/atoms/Button";

describe("Atom: Button", () => {
    it("debería renderizar el texto correctamente", () => {
        render(<Button>Capturar</Button>);
        expect(screen.getByText("Capturar")).toBeInTheDocument();
    });

    it("debería ejecutar la función onClick cuando se hace click", () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByText("Click me");
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("debería estar deshabilitado cuando la prop disabled es true", () => {
        render(<Button disabled>Disabled</Button>);
        // Ant Design suele poner el atributo disabled en el botón nativo interno
        const button = screen.getByRole("button", { name: /disabled/i });
        expect(button).toBeDisabled();
    });
});