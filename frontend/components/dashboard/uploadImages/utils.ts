import * as exifr from 'exifr';

export const extractImageMetadata = async (file: File) => {
    try {
        const metadata = await exifr.parse(file, { tiff: true, xmp: true });
        const title = metadata?.title?.value || '';
        const description = metadata?.description?.value || '';
        const keywords = metadata?.subject || [];
        const category = metadata?.CategoryAS;
        return { title, description, keywords, category };
    } catch (err) {
        console.error('Metadata extraction failed:', err);
        return { title: '', description: '', category: '', keywords: [] };
    }
};
