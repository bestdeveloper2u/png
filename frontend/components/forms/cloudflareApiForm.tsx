"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAddCloudflareConfigMutation, useGetCloudflareConfigQuery } from "@/redux/features/cloudflare/cloudflareApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Field } from "../field/field";

export const CloudflareApiForm = () => {
    const { data, isLoading } = useGetCloudflareConfigQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [addCloudflareConfig, { isLoading: isSubmitting }] = useAddCloudflareConfigMutation();

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            api_key: "",
            account_id: "",
            account_hash: "",
            images_domain: "",
            email: "",
        },
    });

    const [showApiKey, setShowApiKey] = useState(false);
    const [showAccountId, setShowAccountId] = useState(false);
    const [showAccountHash, setShowAccountHash] = useState(false);
    const [showImagesDomain, setShowImagesDomain] = useState(false);
    const [showEmail, setShowEmail] = useState(false);

    useEffect(() => {
        if (data) {
            reset({
                api_key: data.api_key || "",
                account_id: data.account_id || "",
                account_hash: data.account_hash || "",
                images_domain: data.images_domain || "",
                email: data.email || "",
            });
        }
    }, [data, reset]);

    const onSubmit = async (formData: any) => {
        try {
            await addCloudflareConfig(formData).unwrap();
            toast.success('Cloudflare configuration saved successfully!');
        } catch (error: any) {
            const errorData = error?.data;
            const errors = errorData?.errors;
            if (errors && typeof errors === 'object') {
                const firstKey = Object.keys(errors)[0];
                const firstErrorMessage = errors[firstKey]?.[0];
                toast.error(firstErrorMessage);
            } else {
                toast.error('No structured errors found.');
            }
        }
    };

    if (isLoading) return <p className="text-center">Loading...</p>;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-xl mx-auto p-4 space-y-4 bg-white shadow-md rounded-lg w-full"
        >
            <h2 className="text-lg font-semibold text-center mb-4">Cloudflare API Config</h2>
            <Field label="API Key" error={errors.api_key}>
                <div className="relative">
                    <input
                        {...register("api_key", { required: "API Key is required" })}
                        type={showApiKey ? "text" : "password"}
                        id="api_key"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        {showApiKey ? "Hide" : "Show"}
                    </button>
                </div>
            </Field>
            <Field label="Account ID" error={errors.account_id}>
                <div className="relative">
                    <input
                        {...register("account_id", { required: "Account ID is required" })}
                        type={showAccountId ? "text" : "password"}
                        id="account_id"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowAccountId(!showAccountId)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        {showAccountId ? "Hide" : "Show"}
                    </button>
                </div>
            </Field>
            <Field label="Account Hash" error={errors.account_hash}>
                <div className="relative">
                    <input
                        {...register("account_hash", { required: "Account Hash is required" })}
                        type={showAccountHash ? "text" : "password"}
                        id="account_hash"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowAccountHash(!showAccountHash)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        {showAccountHash ? "Hide" : "Show"}
                    </button>
                </div>
            </Field>
            <Field label="Images Domain" error={errors.images_domain}>
                <div className="relative">
                    <input
                        {...register("images_domain", { required: "Images Domain is required" })}
                        type={showImagesDomain ? "text" : "password"}
                        id="images_domain"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowImagesDomain(!showImagesDomain)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        {showImagesDomain ? "Hide" : "Show"}
                    </button>
                </div>
            </Field>
            <Field label="Email" error={errors.email}>
                <div className="relative">
                    <input
                        {...register("email", { required: "Email is required" })}
                        type={showEmail ? "text" : "password"}
                        id="email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowEmail(!showEmail)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        {showEmail ? "Hide" : "Show"}
                    </button>
                </div>
            </Field>
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
};
