"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { MEDIA_URL } from "@/utils/api";
import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { AddSubCategoryForm } from "@/components/forms/addSubCategoryForm";
import { useDeleteSubCategoryMutation, useGetSubCategoriesQuery, usePartialUpdateSubCategoryMutation } from "@/redux/features/sub-categories/subCategoriesApi";
import { useGetSingleSubCategoriesQuery } from "@/redux/features/sub-categories/subCategoriesApi";
import { Field } from "@/components/field/field";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

interface SingleSubCategoryPopupProps {
    subCategorySlug: string;
    onClose: () => void;
    refetch: () => void;
}

export function SingleSubCategoryPopup({ subCategorySlug, onClose, refetch }: SingleSubCategoryPopupProps) {
    const { data, isLoading, isError } = useGetSingleSubCategoriesQuery(subCategorySlug);
    const subCategory = data?.results;

    const [isEditing, setIsEditing] = useState(false);

    const [partialUpdateSubCategory, { isLoading: isUpdating }] = usePartialUpdateSubCategoryMutation();
    const [deleteSubCategory, { isLoading: isDeleting }] = useDeleteSubCategoryMutation();

    const { handleSubmit, control, setValue } = useForm({
        defaultValues: {
            name: subCategory?.name || "",
            icon: null,
        },
    });

    const handleEditClick = () => {
        if (subCategory) {
            setValue("name", subCategory.name);
        }
        setIsEditing(true);
    };

    const handleDelete = async () => {
        if (!subCategory) return;
        if (!confirm("Are you sure you want to delete this subcategory?")) return;

        try {
            await deleteSubCategory(subCategory.id).unwrap();
            toast.success("Subcategory deleted successfully.");
            refetch();
            onClose();
        } catch (error: any) {
            console.log(error.message);
            toast.error("Failed to delete subcategory.");
        }
    };

    const onSubmit = async (formData: any) => {
        if (!subCategory) return;
        try {
            const data = new FormData();
            if (formData.name) data.append("name", formData.name);
            if (formData.icon) data.append("icon", formData.icon);

            await partialUpdateSubCategory({ id: subCategory.id, formData: data }).unwrap();

            toast.success("Subcategory updated successfully.");
            setIsEditing(false);
            refetch();
            onClose();
        } catch (error: any) {
            console.log(error.message);
            toast.error("Failed to update subcategory.");
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError || !subCategory) return <p>Error loading subcategory.</p>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md md:max-w-xl p-6 md:p-8 transform transition-transform duration-300 scale-95 animate-fadeIn overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{subCategory.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl md:text-3xl cursor-pointer">
                        ✕
                    </button>
                </div>

                {!isEditing ? (
                    <>
                        {subCategory.icon && (
                            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md mb-4">
                                <Image
                                    src={`${MEDIA_URL}${subCategory.icon}`}
                                    alt={subCategory.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {subCategory.categories && (
                            <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl mb-4">
                                {subCategory.categories.icon && (
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        <Image
                                            src={`${MEDIA_URL}${subCategory.categories.icon}`}
                                            alt={subCategory.categories.name}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                <span className="text-gray-700 font-semibold text-base md:text-lg">
                                    {subCategory.categories.name}
                                </span>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center mt-4">
                            <button
                                onClick={handleEditClick}
                                className="px-4 py-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Field label="Subcategory Name">
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Name is required" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="text"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                        />
                                    </>
                                )}
                            />
                        </Field>

                        <Field label="Subcategory Icon">
                            <Controller
                                name="icon"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                    />
                                )}
                            />
                        </Field>

                        <div className="flex gap-3 justify-center mt-2">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                {isUpdating ? "Updating..." : "Update"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export const SubCategoriesComponent: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState<any | null>(null);
    const [search, setSearch] = useState("");

    const { data, isLoading, isError, refetch } = useGetSubCategoriesQuery(search, { refetchOnMountOrArgChange: true });

    const subCategories = data?.data;

    return (
        <div className="flex flex-col px-4 py-4 lg:px-10 gap-y-5 w-full h-full relative">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 w-full">
                {/* Add Category Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    type="button"
                    className="relative inline-block px-8 py-3 rounded-full font-medium text-white overflow-hidden group cursor-pointer
                                   bg-gradient-to-r from-[#0077a2] via-blue-600 to-[#38a8e9]
                                   hover:from-[#38a8e9] hover:via-blue-600 hover:to-[#0077a2]
                                   transition-all duration-500 ease-in-out shadow-lg
                                   before:absolute before:inset-0 before:bg-white before:opacity-0 group-hover:before:opacity-10
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077a2]"
                >
                    <span className="relative z-10 text-sm sm:text-base font-semibold transition-transform duration-300 group-hover:scale-105">
                        Add Sub Category
                    </span>
                    {/* Animated Background Shine */}
                    <span className="absolute top-0 left-0 w-0 h-full bg-white opacity-10 rotate-45 transform -translate-x-full group-hover:w-[200%] transition-all duration-700"></span>
                </button>

                {/* Search Bar */}
                <div className="relative w-full sm:w-60">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="search"
                        placeholder="Search sub categories..."
                        className="w-full px-5 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0077a2] focus:border-transparent
                                   transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base placeholder-gray-400 bg-white/90"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <IoSearchOutline className="text-2xl" />
                    </span>
                </div>
            </div>
            {/* Content */}

            <div className="relative block w-full overflow-scroll scrollbar-hidden">
                <div className="block w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full">
                            {isLoading && (
                                <div className="col-span-full text-center py-10 text-gray-500">
                                    Loading categories...
                                </div>
                            )}
                            {isError && (
                                <div className="col-span-full text-center py-10 text-red-500">
                                    Something went wrong while loading categories.
                                </div>
                            )}
                            {!isLoading && !isError && subCategories?.length === 0 && (
                                <div className="col-span-full text-center py-10 text-gray-500">
                                    No categories found.
                                </div>
                            )}
                            {!isLoading && !isError &&
                                subCategories?.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col items-center justify-center border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer"
                                        onClick={() => setSelectedSubCategory(item)}
                                    >
                                        <div className="relative w-full h-48 sm:h-40 md:h-48">
                                            <Image
                                                src={`${MEDIA_URL}${item.icon}`}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                            />
                                        </div>
                                        <h4 className="text-lg font-semibold mt-3 mb-4 text-center px-2">{item.name}</h4>
                                    </div>
                                ))
                            }
                            {isOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg mx-4 p-6 transform transition-transform duration-300 scale-95 animate-fadeIn">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-semibold">Add Sub Category</h2>
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="text-gray-500 hover:text-black text-xl cursor-pointer"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <AddSubCategoryForm
                                            setIsOpen={setIsOpen}
                                            refetch={refetch}
                                        />
                                    </div>
                                </div>
                            )}
                            {selectedSubCategory && (
                                <SingleSubCategoryPopup
                                    subCategorySlug={selectedSubCategory.slug}
                                    onClose={() => setSelectedSubCategory(null)}
                                    refetch={refetch}
                                />
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
}
