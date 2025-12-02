import React from "react";
import { Input as AntInput } from "antd";
import type { PasswordProps } from "antd/es/input/Password";

const { Password } = AntInput;

/**
 * @description Componente `PasswordInput` que actúa como un wrapper sobre el componente `Input.Password` de Ant Design.
 *
 * Este componente se especializa en la entrada de contraseñas, encapsulando el `Input.Password` de Ant Design
 * para asegurar una implementación coherente a través de la aplicación. Al centralizarlo, se facilita
 * la aplicación de estilos y validaciones de forma uniforme.
 *
 * @param {PasswordProps} props - Propiedades que se pasarán al componente `Input.Password` de Ant Design.
 * @returns {React.ReactElement} El componente `Input.Password` de Ant Design con las propiedades proporcionadas.
 */
// Input especializado para contraseñas
export const PasswordInput: React.FC<PasswordProps> = (props) => {
    return <Password {...props} />;
};

/**
 * @description Re-exporta los tipos de `PasswordProps` de Ant Design.
 *
 * Esto permite que otros componentes puedan importar los tipos de las props del `PasswordInput`
 * directamente desde este módulo, manteniendo la consistencia del tipado en toda la aplicación
 * y evitando la necesidad de importar desde "antd" directamente.
 */
export type { PasswordProps };
