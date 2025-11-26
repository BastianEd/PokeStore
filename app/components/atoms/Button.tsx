import React from "react";
import { Button as AntButton } from "antd";      // componente (valor)
import type { ButtonProps } from "antd";        // solo tipo

// Wrapper del botón de Ant Design
export const Button: React.FC<ButtonProps> = (props) => {
    return <AntButton {...props} />;
};

export type { ButtonProps };
