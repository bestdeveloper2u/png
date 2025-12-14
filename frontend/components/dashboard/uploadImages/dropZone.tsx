"use client";

import { ImagePreviewPropsType } from "@/types/imagePreviewPropsType";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

interface Props {
    onDrop: (files: File[]) => void;
    images: ImagePreviewPropsType[];
}

export const DropZone: React.FC<Props> = ({ onDrop, images }: Props) => {
    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        noClick: true,
        noKeyboard: true,
    });

    const uploaded = images.filter((img) => img.status === "success");
    const failed = images.filter((img) => img.status === "error");

    useEffect(() => {
        if (uploaded.length > 0) {
            toast.success(
                `${uploaded.length} ${
                    uploaded.length === 1
                        ? "photo uploaded successfully"
                        : "photos uploaded successfully"
                }`
            );
        }
    }, [uploaded.length]);

    useEffect(() => {
        if (failed.length > 0) {
            toast.error(
                `${failed.length} ${
                    failed.length === 1
                        ? "photo failed to upload"
                        : "photos failed to upload"
                }`
            );
        }
    }, [failed.length]);

    return (
        <div
            {...getRootProps()}
            className="px-2.5 w-full h-full bg-white relative"
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-y-2.5 w-full h-full">
                {images.length === 0 && (
                    <button
                        onClick={open}
                        className="bg-blue-600 text-white text-sm sm:text-base px-5 py-2.5 lg:py-3 rounded hover:bg-blue-700 transition cursor-pointer"
                    >
                        Upload images
                    </button>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 lg:gap-5 w-full max-h-[80vh] overflow-y-auto scrollbar-width">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col items-center border p-2 rounded shadow border-gray-400 cursor-pointer"
                        >
                            <Image
                                src={img.preview}
                                alt={`uploaded-${index}`}
                                className="w-36 h-36 object-contain rounded"
                                width={144}
                                height={144}
                            />
                            {img.status === "loading" && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded">
                                    <div className="w-6 h-6 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            {img.status === "success" && (
                                <div className="absolute top-1 right-1 bg-white rounded-full shadow p-1">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                            )}
                            {img.status === "error" && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded text-white text-xs text-center p-2 border border-gray-300">
                                    <XCircle className="w-6 h-6 text-red-500 mb-1 absolute top-1 right-1" />
                                    <p className="text-sm font-normal">{img.errorMessage || "Upload failed"}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
