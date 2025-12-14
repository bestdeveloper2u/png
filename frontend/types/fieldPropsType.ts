import React from "react";

export interface FieldPropsType {
    label?: string;
    children: React.ReactNode;
    htmlFor?: string;
    error?: {
        message?: string;
    };
};
