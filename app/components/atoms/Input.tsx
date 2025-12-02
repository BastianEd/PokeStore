import React from "react";
import { Input as AntInput } from "antd";
import type { InputProps } from "antd/es/input";

/**
 * @description Componente `Input` que actúa como un wrapper sobre el componente `Input` de Ant Design.
 *
 * Este componente encapsula el `Input` de Ant Design, permitiendo una implementación uniforme
 * a lo largo de la aplicación. Al centralizar su uso, se facilita la aplicación de estilos
 * y comportamientos personalizados de manera consistente.
 *
 * @param {InputProps} props - Propiedades que se pasarán al componente `Input` de Ant Design.
 * @returns {React.ReactElement} El componente `Input` de Ant Design con las propiedades proporcionadas.
 */
// Input genérico para textos
export const Input: React.FC<InputProps> = (props) => {
    return <AntInput {...props} />;
};

/**
 * @description Re-exporta los tipos de `InputProps` de Ant Design.
 *
 * Esto permite que otros componentes puedan importar los tipos de las props del `Input`
 * directamente desde este módulo, promoviendo la consistencia del tipado en toda la aplicación
 * sin necesidad de importar desde "antd" en múltiples lugares.
 */
export type { InputProps };
