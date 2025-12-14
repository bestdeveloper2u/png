import Footer from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "About Us - PNGPoint",
    description: "Learn more about PNGPoint, our mission, vision, and the team dedicated to providing high-quality PNG assets for designers and creators.",
};

export default function AboutRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="relative top-0 left-0 right-0 w-full h-screen">
            <Header />
            {children}
            <Footer />
        </section>
    );
}
