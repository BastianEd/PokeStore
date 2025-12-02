import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PasswordInput } from "~/components/atoms/PasswordInput";

describe("Atom: PasswordInput", () => {
    it("debería renderizar el input de tipo password", () => {
        render(<PasswordInput placeholder="Secreto" />);
        const input = screen.getByPlaceholderText("Secreto");
        expect(input).toHaveAttribute("type", "password");
    });

    it("debería permitir escribir una contraseña", () => {
        const handleChange = vi.fn();
        render(<PasswordInput onChange={handleChange} placeholder="Pass" />);

        const input = screen.getByPlaceholderText("Pass");
        fireEvent.change(input, { target: { value: '123456' } });

        expect(handleChange).toHaveBeenCalled();
        expect(input).toHaveValue('123456');
    });
});