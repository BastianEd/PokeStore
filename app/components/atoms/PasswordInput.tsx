import React from "react";
import { Input as AntInput } from "antd";
import type { PasswordProps } from "antd/es/input/Password";

const { Password } = AntInput;

// Input especializado para contraseñas
export const PasswordInput: React.FC<PasswordProps> = (props) => {
    return <Password {...props} />;
};

export type { PasswordProps };
