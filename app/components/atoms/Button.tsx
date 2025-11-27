import React from "react";
import { Button as AntButton } from "antd"; 
import type { ButtonProps } from "antd";

// Wrapper del botón de Ant Design
export const Button: React.FC<ButtonProps> = (props) => {
    return <AntButton {...props} />;
};

export type { ButtonProps };
