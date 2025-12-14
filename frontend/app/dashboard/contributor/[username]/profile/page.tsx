"use client";

import { Field } from "@/components/field/field";
import { useAddProfileChangeMutation, useGetUserQuery } from "@/redux/features/auth/authApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


const placeholderImage = "https://via.placeholder.com/150?text=No+Image";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  image: FileList | null;
}

export default function Profile() {
    const { data: rawData, isLoading, isError } = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    // Handle if API returns array or object
    const data = Array.isArray(rawData) ? rawData[0] : rawData;

    const [editMode, setEditMode] = useState(false);
    const [addProfileChange] = useAddProfileChangeMutation();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ProfileFormData>({
        defaultValues: {
            first_name: "",
            last_name: "",
            image: null,
        },
    });

    const imageFile = watch("image");

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            reset({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                image: null,
            });
            setImagePreview(data.image || placeholderImage);
        }
    }, [data, reset]);

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            return () => URL.revokeObjectURL(previewUrl); // cleanup
        }
    }, [imageFile]);

    const onSubmit = async (formData: ProfileFormData) => {
        const formDataToSend = new FormData();
        formDataToSend.append("first_name", formData.first_name);
        formDataToSend.append("last_name", formData.last_name);
        if (formData.image?.[0]) {
            formDataToSend.append("image", formData.image[0]);
        }

        try {
            await addProfileChange(formDataToSend).unwrap();
            toast.success("Profile updated!");
            setEditMode(false);
        } catch (err: any) {
            const errData = err?.data;
            const errors = errData?.errors ?? errData;
            if (errors && typeof errors === "object" && Object.keys(errors).length > 0) {
                const firstKey = Object.keys(errors)[0];
                const firstMessage = errors[firstKey]?.[0] ?? errors[firstKey];
                toast.error(firstMessage || "Update failed");
            } else {
                toast.error(errData?.detail || errData?.message || "Update failed");
            }
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError || !data) return <p>Something went wrong.</p>;

    return (
        <div className="flex justify-center items-center w-full p-4 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
                {!editMode ? (
                    <div className="flex flex-col items-center text-center">
                        <Image
                            src={data.image || placeholderImage}
                            alt={data.username}
                            className="w-24 h-24 rounded-full object-cover border"
                            width={96}
                            height={96}
                        />
                        <h3 className="text-xl font-semibold mt-3">
                            {data.first_name} {data.last_name}
                        </h3>
                        <p className="text-sm text-gray-600 username">@{data.username}</p>
                        <p className="text-sm text-gray-500 mt-1 email">{data.email}</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Joined: {new Date(data.date_joined).toLocaleDateString()}
                        </p>
                        <button
                            onClick={() => setEditMode(true)}
                            className="mt-4 px-4 py-2 cursor-pointer text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Field label="Image" error={errors.image}>
                            <input
                                {...register("image")}
                                type="file"
                                accept="image/*"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </Field>
                        {imagePreview && (
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                className="w-24 h-24 rounded-full object-cover border mx-auto mb-4"
                                width={96}
                                height={96}
                            />
                        )}
                        <Field label="First Name" error={errors.first_name}>
                            <input
                                {...register("first_name", { required: "First name is required" })}
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </Field>
                        <Field label="Last Name" error={errors.last_name}>
                            <input
                                {...register("last_name", { required: "Last name is required" })}
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </Field>
                        <div className="flex gap-4 pt-2">
                            <button
                                type="submit"
                                className="flex-1 cursor-pointer bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                className="flex-1 cursor-pointer bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
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
