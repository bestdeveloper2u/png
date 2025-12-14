import Footer from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { siteConfig, getSiteHostname } from "@/config/site";

export default function License() {
    const hostname = getSiteHostname();
    
    return (
        <>
            <Header />
            <section className="relative top-0 left-0 right-0 py-6 lg:py-12 w-full bg-[#FBFAFF]">
                <div className="max-w-screen-lg container mx-auto px-4 lg:px-6 w-full">
                    <div className="bg-white shadow-sm rounded-2xl p-6 lg:p-10">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                            License & Usage Policy - {siteConfig.siteName}
                        </h1>
                        <p className="text-gray-700 mb-6">
                            Welcome to <span className="font-semibold">{siteConfig.siteName}</span>,
                            your free source for high-quality PNG images with transparent
                            backgrounds. To ensure clarity for our users and contributors,
                            please read our license and usage policy carefully.
                        </p>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-green-600 mb-3">
                                What You Can Do
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>
                                    <span className="font-medium">Free Downloads</span> - All PNG
                                    images on {hostname} are available for free download.
                                </li>
                                <li>
                                    <span className="font-medium">Personal & Commercial Use</span>{" "}
                                    - You may use our PNGs in personal projects, school work,
                                    websites, social media, presentations, or even in commercial
                                    designs, advertisements, and client projects.
                                </li>
                                <li>
                                    <span className="font-medium">Editing & Modifications</span> -
                                    You are allowed to edit, crop, recolor, or combine PNG files
                                    with your own work.
                                </li>
                                <li>
                                    <span className="font-medium">No Attribution Required</span> -
                                    Giving credit is not mandatory, but a backlink to
                                    {hostname} is always appreciated to support our community.
                                </li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-red-600 mb-3">
                                What You Cannot Do
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>
                                    <span className="font-medium">No Selling of Files</span> - You
                                    cannot sell or redistribute PNG files as standalone downloads
                                    (free or paid) on other websites, apps, or marketplaces.
                                </li>
                                <li>
                                    <span className="font-medium">No Claim of Ownership</span> -
                                    Do not claim images from {hostname} as your own original
                                    work.
                                </li>
                                <li>
                                    <span className="font-medium">No Automated Bulk Downloading</span>{" "}
                                    - Using bots or automated tools to scrape or mass-download
                                    PNGs is strictly prohibited.
                                </li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-600 mb-3">
                                License Type
                            </h2>
                            <p className="text-gray-700">
                                All PNGs on {hostname} are provided under a free-to-use
                                license. This means they are royalty-free and safe to use for
                                both personal and commercial projects, as long as you follow the
                                restrictions listed above.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-yellow-600 mb-3">
                                Important Note
                            </h2>
                            <p className="text-gray-700">
                                Some PNG files may be user-submitted or derived from third-party
                                sources. While we take care to provide only free-to-use images,
                                {hostname} does not guarantee absolute exclusivity of rights.
                                If you are working on highly sensitive or trademark-related
                                projects, we recommend double-checking the image usage rights or
                                contacting us for clarification.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-purple-600 mb-3">
                                Contribute & Support
                            </h2>
                            <p className="text-gray-700">
                                If you enjoy our free resources, please consider sharing
                                {hostname} with your friends, linking to us from your blog, or
                                following us on social media. Your support helps us keep
                                providing free PNG images to everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
