/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useDeleteCategoryMutation, useGetSingleCategoriesQuery, usePartialUpdateCategoryMutation } from "@/redux/features/categories/categoriesApi";
import { MEDIA_URL } from "@/utils/api";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Field } from "@/components/field/field";
import { toast } from "react-toastify";

interface SingleCategoryPopupProps {
    categorySlug: string;
    onClose: () => void;
    refetch: () => void;
}

export default function SingleCategoryPopup({ categorySlug, onClose, refetch }: SingleCategoryPopupProps) {
    const { data, isLoading, isError } = useGetSingleCategoriesQuery(categorySlug);
    const category = data?.data;

    const [isEditing, setIsEditing] = useState(false);

    const [partialUpdateCategory, { isLoading: isUpdating }] = usePartialUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const { handleSubmit, control, setValue } = useForm({
        defaultValues: {
            name: category?.name || "",
            icon: null,
        },
    });

    const handleEditClick = () => {
        if (category) setValue("name", category.name);
        setIsEditing(true);
    };

    const handleDelete = async () => {
        if (!category) return;
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await deleteCategory(category.id).unwrap();
            toast.success("Category deleted successfully.");
            refetch();
            onClose();
        } catch (error: any) {
            console.log(error.message);
            toast.error("Failed to delete category.");
        }
    };

    const onSubmit = async (formData: any) => {
        if (!category) return;
        try {
            const data = new FormData();
            if (formData.name) data.append("name", formData.name);
            if (formData.icon) data.append("icon", formData.icon);

            await partialUpdateCategory({ id: category.id, formData: data }).unwrap();
            toast.success("Category updated successfully.");
            setIsEditing(false);
            refetch();
            onClose();
        } catch (error: any) {
            console.log(error.message);
            toast.error("Failed to update category.");
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError || !category) return <p>Error loading category.</p>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md md:max-w-xl p-6 md:p-8 transform transition-transform duration-300 scale-95 animate-fadeIn overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{category.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl md:text-3xl cursor-pointer">✕</button>
                </div>

                {!isEditing ? (
                    <>
                        {category.icon && (
                            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md mb-4">
                            <Image src={`${MEDIA_URL}${category.icon}`} alt={category.name} fill className="object-cover" />
                        </div>
                        )}
                        

                        {category.sub_categories?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 w-full mb-4">
                                {category.sub_categories.map((sub: any) => (
                                    <div key={sub.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">


                                        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md mb-4">
                                            {category.icon && (
                                                <Image
                                                src={category.icon ? `${MEDIA_URL}${category.icon}` : '/placeholder.png'}
                                                alt={category.name}
                                                fill
                                                className="object-cover"
                                            />
                                            )}
                                            
                                        </div>



                                        <span className="text-gray-700 font-semibold text-base md:text-lg">{sub.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center mb-4">No subcategories available.</p>
                        )}

                        <div className="flex gap-3 justify-center mt-4">
                            <button onClick={handleEditClick} className="px-4 py-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Edit</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600">
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Field label="Category Name">
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Name is required" }}
                                render={({ field }) => (
                                    <input {...field} type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                                )}
                            />
                        </Field>

                        <Field label="Category Icon">
                            <Controller
                                name="icon"
                                control={control}
                                render={({ field }) => (
                                    <input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                )}
                            />
                        </Field>

                        <div className="flex gap-3 justify-center mt-2">
                            <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                {isUpdating ? "Updating..." : "Update"}
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
