import Footer from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Privacy Policy - PNGPoint",
    description: "At PNGPoint, we value your privacy and are committed to protecting your personal information. Our Privacy Policy explains what data we collect, how we use it, and the measures we take to keep it secure. By using our website, you can be assured that your information is handled responsibly and transparently.",
};

export default function PrivacyRootLayout({
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
