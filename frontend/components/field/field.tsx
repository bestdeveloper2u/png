import React from "react";
import { FieldPropsType } from "@/types/fieldPropsType";

export const Field: React.FC<FieldPropsType> = ({ label, children, htmlFor, error }) => {
    const getChildId = (children: React.ReactNode) => {
        if (React.Children.count(children) === 1) {
            const child = React.Children.only(children) as React.ReactElement<{ id?: string }>;
            return child?.props?.id;
        }
        return undefined;
    };

    const id = htmlFor || getChildId(children);

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm md:text-base font-medium" htmlFor={id}>
                    {label}
                </label>
            )}
            {children}
            {error?.message && (
                <p className="text-red-500 font-medium text-sm" role="alert">
                    {error.message}
                </p>
            )}
        </div>
    );
};
