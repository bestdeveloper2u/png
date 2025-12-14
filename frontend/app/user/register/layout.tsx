import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "PNG Point Register Form",
    description: "PNG Point Register Form",
};

export default function RegisterRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="relative top-0 left-0 right-0 w-full h-screen">
            {children}
        </section>
    );
}
