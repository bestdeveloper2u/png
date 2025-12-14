import { CloudflareApiForm } from "@/components/forms/cloudflareApiForm";

export default function CloudflareConfiguration() {
    return (
        <div className="flex flex-col justify-start px-2.5 lg:px-10 pb-1 lg:pb-2.5 h-full relative overflow-hidden">
            <div className="flex flex-col flex-wrap justify-center items-center w-full h-full">
                <CloudflareApiForm />
            </div>
        </div>
    );
};
