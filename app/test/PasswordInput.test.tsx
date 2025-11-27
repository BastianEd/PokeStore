import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PasswordInput } from "~/components/atoms/PasswordInput";

describe("Atom: PasswordInput", () => {
    it("debería renderizar con el placeholder correcto", () => {
        render(<PasswordInput placeholder="Contraseña secreta" />);
        expect(screen.getByPlaceholderText("Contraseña secreta")).toBeInTheDocument();
    });

    it("debería tener el tipo 'password' por defecto", () => {
        render(<PasswordInput placeholder="pass" />);
        const input = screen.getByPlaceholderText("pass");
        expect(input).toHaveAttribute("type", "password");
    });

    it("debería capturar el cambio de valor", () => {
        const handleChange = vi.fn();
        render(<PasswordInput onChange={handleChange} placeholder="pass" />);

        const input = screen.getByPlaceholderText("pass");
        fireEvent.change(input, { target: { value: 'pikachu123' } });

        expect(handleChange).toHaveBeenCalled();
        expect(input).toHaveValue('pikachu123');
    });

    // Test opcional: Verificar que el botón de "ojo" (toggle visibility) existe
    it("debería renderizar el icono de visibilidad", () => {
        render(<PasswordInput />);
        // Ant Design suele usar un span con clase ant-input-password-icon
        const toggleIcon = document.querySelector(".ant-input-password-icon");
        expect(toggleIcon).toBeInTheDocument();
    });
});