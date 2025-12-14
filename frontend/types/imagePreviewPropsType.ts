export interface ImagePreviewPropsType {
    file: File;
    preview: string;
    status: "loading" | "success" | "error";
    image_id?: string | null;
    errorMessage?: string;
};
