"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Field } from "../field/field";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAddCategoryMutation } from "@/redux/features/categories/categoriesApi";

interface AddCategoryFormProps {
    setIsOpen: (open: boolean) => void;
    refetch: () => void;
}

export const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ setIsOpen, refetch }) => {
    const { handleSubmit, control, reset, formState: { errors } } = useForm();
    const [preview, setPreview] = useState<string | null>(null);

    const [addCategory, { isLoading }] = useAddCategoryMutation();

    const onSubmit = async (formData: any) => {
        try {
            const data = new FormData();
            data.append("name", formData.name);
            if (formData.icon) {
                data.append("icon", formData.icon);
            }

            await addCategory(data).unwrap();
            reset();
            setPreview(null);
            toast.success("Category added successfully.");
            setIsOpen(false);
            refetch();
        } catch (error: any) {
            const errorData = error?.data;
            const errorsResp = errorData?.errors;
            if (errorsResp && typeof errorsResp === "object") {
                const firstKey = Object.keys(errorsResp)[0];
                const firstErrorMessage = errorsResp[firstKey]?.[0];
                toast.error(firstErrorMessage);
            } else {
                toast.error("No structured errors found.");
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-4 bg-white shadow-md rounded-2xl space-y-4"
        >
            <div className="flex flex-col flex-wrap gap-y-2.5">
                <Field label="Category Image" error={errors.icon}>
                    <Controller
                        name="icon"
                        control={control}
                        rules={{ required: "Image is required" }}
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col items-center">
                                <label
                                    htmlFor="icon"
                                    className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition"
                                >
                                    {preview ? (
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            className="h-48 w-full object-cover rounded-lg shadow"
                                            width={192}
                                            height={192}
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-sm text-center">
                                            Click to upload
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    id="icon"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        setPreview(file ? URL.createObjectURL(file) : null);
                                        field.onChange(file);
                                    }}
                                />
                                {fieldState.error && (
                                    <span className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </span>
                                )}
                            </div>
                        )}
                    />
                </Field>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5">
                <Field label="Category Name" error={errors.name}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Category name is required" }}
                        render={({ field, fieldState }) => (
                            <>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter category name"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                    {...field}
                                />
                                {fieldState.error && (
                                    <span className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </span>
                                )}
                            </>
                        )}
                    />
                </Field>
            </div>
            <div className="text-center">
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </form>
    );
};
