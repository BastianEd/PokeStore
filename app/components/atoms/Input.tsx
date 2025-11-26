import React from "react";
import { Input as AntInput } from "antd";
import type { InputProps } from "antd/es/input";

// Input genérico para textos
export const Input: React.FC<InputProps> = (props) => {
    return <AntInput {...props} />;
};

export type { InputProps };
