import { SERVER_URL } from "@/utils/api";
import { getFetchData } from "@/utils/getFetchData";
import { SingleImages } from "@/components/singleimages/singleimages";
import { getImageUrl } from "@/config/site";

type SingleImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SingleImage({ params }: SingleImageProps) {
  const { slug } = await params;

    const image = await getFetchData(`${SERVER_URL}/images/${slug}/`);
    const pageUrl = getImageUrl(slug);

    return (
        <section className="relative py-5 lg:py-10 w-full bg-white">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <SingleImages image={image} pageUrl={pageUrl} slug={slug} />
            </div>
        </section>
    );
}
