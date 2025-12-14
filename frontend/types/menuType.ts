import type { JSX } from "react";

export interface MenuType {
    id?: number;
    name?: string;
    path?: string;
     icon?: JSX.Element;
    submenu?: MenuType[];
};
