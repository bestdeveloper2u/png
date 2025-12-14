/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { Field } from "@/components/field/field";
import { ReactIcons } from "@/utils/reactIcons";
import { RootState } from "@/redux/store";
import {
    useBulkImageUpdateMutation,
    useUpdatedImageMutation
} from "@/redux/features/images/updatedApi";
import { useSingleImageDeleteMutation } from "@/redux/features/images/deletedApi";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import {
    clearSelectedMetadata,
    closeSidebar,
    resetAllSave,
    clearSelectedImageIds
} from "@/redux/features/imageSidebar/imageSideBarSlice";
import { ImagesResponse, KeywordsResponse } from "@/types/imagesResponse";

interface SelectedImageSidebarProps {
    selectedImageData: ImagesResponse;
    refetch?: () => void;
}

export const SelectedImageSidebar: React.FC<SelectedImageSidebarProps> = ({
    selectedImageData,
    refetch
}) => {
    const dispatch = useDispatch();
    const { RiDeleteBin6Line } = ReactIcons;

    const selectedImageIds = useSelector((state: RootState) => state.imageSideBar.selectedImageIds);
    const auth = useSelector((state: RootState) => state.auth);
    const role = auth?.user?.role;

    const [keywords, setKeywords] = useState<KeywordsResponse[]>(
        selectedImageData?.keywords?.map((k) => ({
            id: k.id,
            name: k.name,
            slug: k.slug ?? k.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        })) || []
    );
    const [showKeywordInput, setShowKeywordInput] = useState(false);
    const [newKeyword, setNewKeyword] = useState("");

    const [selectedCategory, setSelectedCategory] = useState<number | "">(
        selectedImageData?.category?.id ?? ""
    );
    const [selectedSubCategory, setSelectedSubCategory] = useState<number | "">(
        selectedImageData?.sub_category?.id ?? ""
    );
    const [subCategories, setSubCategories] = useState<any[]>([]);

    const { data: categoriesData } = useGetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });

    const [deleteSingleImage] = useSingleImageDeleteMutation();
    const [updatedImage] = useUpdatedImageMutation();
    const [bulkImageUpdate] = useBulkImageUpdateMutation();

    const { handleSubmit, register, reset, setValue, formState: { errors } } = useForm<any>();

    // Keyword management
    const addKeyword = () => {
        const trimmed = newKeyword.trim();
        if (!trimmed || keywords.find((k) => k.name.toLowerCase() === trimmed.toLowerCase())) {
            setNewKeyword("");
            setShowKeywordInput(false);
            return;
        }

        const slug = trimmed.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const maxId = keywords.reduce((max, kw) => (typeof kw.id === "number" && kw.id > max ? kw.id : max), 0);
        const newId = maxId + 1;

        const updated = [...keywords, { id: newId, name: trimmed, slug }];
        setKeywords(updated);
        setValue("keywords", updated);
        setNewKeyword("");
        setShowKeywordInput(false);
    };

    const removeKeyword = (kwName: string) => {
        const updated = keywords.filter((k) => k.name !== kwName);
        setKeywords(updated);
        setValue("keywords", updated);
    };

    // Category/Subcategory change
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = parseInt(e.target.value);
        setSelectedCategory(categoryId);

        const categoryObj = categoriesData?.data?.find((cat: any) => cat.id === categoryId);
        setSubCategories(categoryObj?.sub_categories ?? []);
        setSelectedSubCategory("");
        setValue("sub_category", "");
    };

    const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subCategoryId = parseInt(e.target.value);
        setSelectedSubCategory(subCategoryId);
        setValue("sub_category", subCategoryId);
    };

    // Initialize form & subcategories
    useEffect(() => {
        const defaultKeywords = selectedImageData?.keywords?.map((k) => ({
            id: k.id,
            name: k.name,
            slug: k.slug ?? k.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        })) || [];

        reset({
            title: selectedImageData?.title || "",
            description: selectedImageData?.description || "",
            status: selectedImageData?.status || "",
            keywords: defaultKeywords,
            category: selectedImageData?.category?.id ?? "",
            sub_category: selectedImageData?.sub_category?.id ?? ""
        });

        setKeywords(defaultKeywords);

        if (selectedImageData?.category) {
            const categoryObj = categoriesData?.data?.find(
                (cat: any) => cat.id === selectedImageData.category?.id
            );
            setSubCategories(categoryObj?.sub_categories ?? []);
        }
    }, [selectedImageData, categoriesData, reset]);

    // Delete image
    const handleImageDeleted = async (ID: number) => {
        try {
            await deleteSingleImage(ID).unwrap();
            toast.success("Image deleted successfully!");
            dispatch(closeSidebar());
            dispatch(clearSelectedMetadata());
            if (refetch) refetch();
        } catch (err) {
            console.error("Delete Failed:", err);
            toast.error("Image delete Failed!");
        }
    };

    const onSubmitForm = async (formData: any) => {
        // Check if multiple images are selected
        if (selectedImageIds.length > 1) {
            // BULK UPDATE
            const payload = {
                image_ids: selectedImageIds,
                status: formData.status,
                category: formData.category,
                sub_category: formData.sub_category,
            };

            try {
                await bulkImageUpdate(payload).unwrap();
                toast.success("Bulk update successful!");
                dispatch(closeSidebar());
                dispatch(clearSelectedMetadata());
                dispatch(clearSelectedImageIds());
                if (refetch) refetch();
            } catch (err) {
                console.error("Bulk update failed:", err);
                toast.error("Bulk update failed.");
            } finally {
                dispatch(clearSelectedImageIds());
                dispatch(resetAllSave());
                dispatch(closeSidebar());
                dispatch(clearSelectedMetadata());
            }

            return;
        }

        // SINGLE IMAGE UPDATE

        const payload: any = {};
        if (formData.title !== selectedImageData.title) payload.title = formData.title;
        if (formData.description !== selectedImageData.description) payload.description = formData.description;
        if (formData.status !== selectedImageData.status) payload.status = formData.status;
        if (formData.category !== selectedImageData?.category?.id) payload.category = formData.category;
        if (formData.sub_category !== selectedImageData?.sub_category?.id) payload.sub_category = formData.sub_category;

        const originalKeywords = (selectedImageData?.keywords || []).map((k: any) => k.name);
        const currentKeywords = keywords.map((k) => k.name);
        const keywordsChanged =
            originalKeywords.length !== currentKeywords.length ||
            !originalKeywords.every((kw) => currentKeywords.includes(kw));

        if (keywordsChanged) payload.keywords = keywords.map((kw) => ({ id: kw.id, name: kw.name }));

        if (Object.keys(payload).length === 0) {
            toast.info("Nothing changed to update.");
            return;
        }

        try {
            await updatedImage({ id: selectedImageData.id, data: payload }).unwrap();
            toast.success("Image updated successfully!");
            dispatch(closeSidebar());
            dispatch(clearSelectedMetadata());
            dispatch(clearSelectedImageIds());
            if (refetch) refetch();
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update image.");
        }
    };

    return (
        <div className="block w-full h-auto px-2.5 py-2.5 border border-gray-300 rounded-md ">
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                {/* DELETE IMAGE */}
                <div className="flex flex-row flex-wrap items-center justify-between py-2.5 px-2.5 rounded bg-gray-300 w-full">
                    <button type="button" onClick={() => handleImageDeleted(selectedImageData.id)}>
                        <RiDeleteBin6Line className="text-2xl cursor-pointer" />
                    </button>
                </div>

                {/* IMAGE */}
                <div className="flex flex-col w-full">
                    <Image
                        className="block w-full h-auto rounded border border-gray-300"
                        src={selectedImageData?.cloudflare_url}
                        alt={selectedImageData?.title}
                        width={300}
                        height={300}
                    />
                </div>

                {/* FORM */}
                <form className="flex flex-col gap-y-2.5 w-full" onSubmit={handleSubmit(onSubmitForm)}>
                    {/* TITLE */}
                    <Field label="Title" error={errors.title}>
                        <input
                            className="border border-gray-300 py-2.5 px-2.5 rounded w-full"
                            {...register("title")}
                            type="text"
                        />
                    </Field>

                    {/* DESCRIPTION */}
                    <Field label="Description" error={errors.description}>
                        <textarea
                            className="border border-gray-300 py-2.5 px-2.5 rounded w-full"
                            {...register("description")}
                        />
                    </Field>

                    {/* KEYWORDS */}
                    <Field label="Keywords" error={errors.keywords}>
                        <div className="flex flex-wrap gap-2 border border-gray-300 py-2.5 px-2.5 rounded">
                            {keywords.map((kw, idx) => (
                                <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                                    {kw.name}
                                    <button
                                        type="button"
                                        onClick={() => removeKeyword(kw.name)}
                                        className="text-red-500 cursor-pointer"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        {showKeywordInput && (
                            <input
                                type="text"
                                className="border border-gray-300 py-2.5 px-2.5 rounded w-full"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addKeyword();
                                    }
                                }}
                                autoFocus
                            />
                        )}
                        <button
                            type="button"
                            className="text-blue-600 text-sm mt-2 cursor-pointer w-fit"
                            onClick={() => setShowKeywordInput(true)}
                        >
                            + Add keyword
                        </button>
                    </Field>

                    {/* CATEGORIES */}
                    <Field label="Categories" error={errors.category}>
                        <select
                            className="border border-gray-300 py-2.5 px-2.5 rounded w-full capitalize"
                            {...register("category")}
                            value={selectedCategory || ""}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select category</option>
                            {categoriesData?.data?.map((category: any) => (
                                <option value={category.id} key={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {/* SUBCATEGORIES */}
                    <Field label="Sub Categories" error={errors.sub_category}>
                        <select
                            className="border border-gray-300 py-2.5 px-2.5 rounded w-full capitalize"
                            {...register("sub_category")}
                            value={selectedSubCategory || ""}
                            onChange={handleSubCategoryChange}
                        >
                            <option value="">Select subcategory</option>
                            {subCategories.map((sub: any) => (
                                <option value={sub.id} key={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {/* STATUS */}
                    {role === "admin" && (
                        <Field label="Status" error={errors.status}>
                            <select
                                className="border border-gray-300 py-2.5 px-2.5 rounded w-full capitalize"
                                {...register("status")}
                                defaultValue={selectedImageData?.status ?? "pending"}
                            >
                                <option value="approved">approved</option>
                                <option value="pending">pending</option>
                                <option value="rejected">rejected</option>
                            </select>
                        </Field>
                    )}

                    {/* USER DETAILS */}
                    <div className="flex flex-col flex-wrap gap-2.5 border border-gray-300 py-2 px-2.5 rounded">
                        <h4 className="text-base font-medium">Contributor details</h4>
                        <div className="flex flex-col flex-wrap gap-y-1.5">
                            {selectedImageData?.user?.username && <span>Username : {selectedImageData?.user?.username}</span>}
                            {selectedImageData?.user?.first_name && <span>First Name : {selectedImageData?.user?.first_name}</span>}
                            {selectedImageData?.user?.last_name && <span>Last Name : {selectedImageData?.user?.last_name}</span>}
                            {selectedImageData?.user?.email && (
                                <Link className="w-fit" href={`mailto:${selectedImageData?.user?.email}`}>
                                    Email : {selectedImageData?.user?.email}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="flex flex-col">
                        <button
                            className="bg-blue-500 text-white py-2.5 px-2.5 rounded-full cursor-pointer"
                            type="submit"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
