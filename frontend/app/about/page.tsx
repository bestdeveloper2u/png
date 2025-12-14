export default function About() {
    return (
        <section className="relative top-0 left-0 right-0 py-5 lg:py-10 w-full bg-[#FBFAFF]">
            <div className="max-w-screen-lg container mx-auto px-2.5 lg:px-5 w-full">
                <h1 className="text-3xl lg:text-5xl font-bold mb-5 lg:mb-8 text-center">About Us</h1>
                <div className="flex flex-col flex-wrap gap-y-5 w-full">
                    <div className="flex flex-col flex-wrap w-full gap-y-2.5">
                        <h2 className="text-xl md:text-2xl font-semibold">Who We Are</h2>
                        <p className="text-sm md:text-base font-normal text-justify sm:text-start">
                            PNGPoint is a creative and resourceful platform dedicated to providing designers, developers, and content creators with a wide range of high-quality PNG assets. Our goal is to simplify the
                            design process by offering transparent, royalty-free images that can be used in various personal and commercial projects. We believe that visual content should be easily accessible to everyone. Whether you re a graphic designer creating branding assets, a developer building user interfaces, or a content creator looking for engaging visuals, PNGPoint offers a curated collection of PNGs to meet your every need. With a focus on clarity, quality, and simplicity, we ensure that our assets are optimized,
                            searchable, and free to use—without the hassle.
                        </p>
                    </div>
                    <div className="flex flex-col flex-wrap w-full gap-y-2.5">
                        <h2 className="text-xl md:text-2xl font-semibold">Our Mission</h2>
                        <p className="text-sm md:text-base font-normal text-justify sm:text-start">
                            Our mission is to empower creators and innovators across the globe by providing free, accessible, and high-quality PNG graphics that meet professional standards.We aim to remove the barriers to great design by ensuring that anyone — regardless of budget, skill level, or background — can access the visual tools they need to bring their ideas to life. Every image on our platform is optimized for clarity, creativity, and usability — helping you create stunning visuals faster and smarter.
                        </p>
                    </div>
                    <div className="flex flex-col flex-wrap w-full gap-y-2.5">
                        <h2 className="text-xl md:text-2xl font-semibold">Our Vision</h2>
                        <p className="text-sm md:text-base font-normal text-justify sm:text-start">
                            Our vision is to become the world’s most trusted platform for transparent image assets, making creativity limitless for everyone. We dream of a world where graphic designers, developers, content creators, and students can collaborate and innovate using visuals that are freely available, professionally curated, and constantly evolving. PNGPoint envisions a future where anyone with a creative spark can bring their imagination to life — effortlessly and affordably.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
