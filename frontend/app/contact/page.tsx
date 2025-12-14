import Link from "next/link";
import { siteConfig, getSiteHostname } from "@/config/site";

export default function Contact() {
    const hostname = getSiteHostname();
    const supportEmail = `support@${hostname}`;
    
    return (
        <section className="relative top-0 left-0 right-0 py-5 lg:py-10 w-full bg-[#FBFAFF] lg:h-[60vh]">
            <div className="max-w-screen-lg container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap">
                    <h1 className="text-3xl lg:text-5xl font-bold mb-5 lg:mb-8 text-center">Contact Us</h1>
                    <p className="md:text-sm lg:text-base text-justify">
                        Communicate Us Thank you for your interest in {siteConfig.siteName}. We re always then to support you — whether you have a question about our PNG means, need help navigating the platform, or want to unite with us. Our platoon is ready to give prompt and helpful responses to all your inquiries. Below, you'll find the stylish ways to reach us, along with our office address, support hours, and social links.
                    </p>
                    <br />
                    <Link href={`mailto:${supportEmail}`} className="text-blue-600 underline">{supportEmail}</Link>
                </div>
            </div>
        </section>
    );
}
