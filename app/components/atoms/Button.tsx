import React from "react";
import { Button as AntButton } from "antd"; 
import type { ButtonProps } from "antd";

/**
 * @description Componente `Button` que actúa como un wrapper sobre el componente `Button` de Ant Design.
 *
 * Este componente reutiliza la funcionalidad del botón de Ant Design, permitiendo una
 * implementación consistente a través de la aplicación. Al centralizar el componente del botón,
 * se facilita la aplicación de estilos y comportamientos personalizados en un solo lugar.
 *
 * @param {ButtonProps} props - Las propiedades que se pasarán al componente `Button` de Ant Design.
 * @returns {React.ReactElement} El componente `Button` de Ant Design con las propiedades proporcionadas.
 */
// Wrapper del botón de Ant Design
export const Button: React.FC<ButtonProps> = (props) => {
    return <AntButton {...props} />;
};

/**
 * @description Re-exporta los tipos de `ButtonProps` de Ant Design.
 *
 * Esto permite que otros componentes y archivos puedan importar los tipos de las props del botón
 * directamente desde este módulo, manteniendo la consistencia del tipado a través de la aplicación
 * sin necesidad de importar desde "antd" directamente.
 */
export type { ButtonProps };
