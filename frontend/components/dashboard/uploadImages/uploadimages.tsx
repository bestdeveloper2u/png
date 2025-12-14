/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import pLimit from "p-limit";
import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { ImagePreviewPropsType } from "@/types/imagePreviewPropsType";
import { useImageUploadMutation } from "@/redux/features/images/uploadApi";
import { DropZone } from "./dropZone";
import { extractImageMetadata } from "./utils";
import {
    finishUpload,
    startLoading,
    stopLoading,
} from "@/redux/features/status/statusSlice";

export default function UploadImagesComponent() {
    const [images, setImages] = useState<ImagePreviewPropsType[]>([]);

    const dispatch = useDispatch();
    const [imageUpload] = useImageUploadMutation();

    const handleDrop = useCallback(
        async (files: File[]) => {
            const newImages = files.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                status: "loading" as const,
            }));

            setImages((prev) => [...prev, ...newImages]);

            const batchSize = 10;
            const limit = pLimit(2);
            const totalBatches = Math.ceil(newImages.length / batchSize);
            const uploadTasks = [];

            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = start + batchSize;
                const currentBatch = newImages.slice(start, end);

                const task = limit(async () => {
                    try {
                        dispatch(startLoading());

                        const metadataList = await Promise.all(
                            currentBatch.map((img) => extractImageMetadata(img.file))
                        );

                        const formData = new FormData();
                        currentBatch.forEach((img, idx) => {
                            const metadata = metadataList[idx];
                            formData.append("images", img.file);
                            formData.append("title", metadata.title);
                            formData.append("description", metadata.description);
                            formData.append("keywords", metadata.keywords);
                        });

                        const response = await imageUpload(formData).unwrap();

                        const uploaded = response?.uploaded || [];
                        const failed = response?.failed || [];

                        setImages((prev) => {
                            const updated = [...prev];
                            for (let i = 0; i < currentBatch.length; i++) {
                                const globalIndex = prev.length - newImages.length + start + i;
                                const failedItem = failed.find(
                                    (f: any) => f.filename === currentBatch[i].file.name
                                );

                                if (failedItem) {
                                    updated[globalIndex] = {
                                        ...currentBatch[i],
                                        status: "error",
                                        errorMessage: failedItem.error,
                                    };
                                } else {
                                    const uploadedItem = uploaded[i];
                                    updated[globalIndex] = {
                                        ...currentBatch[i],
                                        status: "success",
                                        image_id: uploadedItem?.image_id || null,
                                    };
                                }
                            }
                            return updated;
                        });
                    } catch (error: any) {
                        console.error("Batch upload failed:", error);
                        setImages((prev) => {
                            const updated = [...prev];
                            for (let i = 0; i < currentBatch.length; i++) {
                                const globalIndex = prev.length - newImages.length + start + i;
                                updated[globalIndex] = {
                                    ...currentBatch[i],
                                    status: "error",
                                    errorMessage:
                                        error?.data?.errors?.name?.[0] ||
                                        error?.message ||
                                        "Unknown error occurred",
                                };
                            }
                            return updated;
                        });
                    } finally {
                        dispatch(stopLoading());
                        dispatch(finishUpload());
                    }
                });

                uploadTasks.push(task);
            }

            await Promise.all(uploadTasks);
        },
        [imageUpload, dispatch]
    );

    return (
        <div className="flex flex-col flex-wrap items-center justify-center px-2.5 lg:px-10 h-full relative">
            <div className="flex flex-row flex-wrap justify-between w-full overflow-hidden h-[98%]">
                <div className="flex flex-wrap items-center w-full h-full overflow-x-hidden overflow-y-auto scrollbar-width">
                    <DropZone
                        onDrop={handleDrop}
                        images={images}
                    />
                </div>
            </div>
        </div>
    );
}
