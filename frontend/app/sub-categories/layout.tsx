import Footer from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Browse All PNG Image Sub Categories | Free Transparent PNGs | PNGPoint",
    description: "Discover our full collection of PNG images, neatly organized by category for quick and easy downloads.",
};

export default function SubCategoriesRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="relative top-0 left-0 right-0 w-full">
            <Header />
            {children}
            <Footer />
        </section>
    );
}
