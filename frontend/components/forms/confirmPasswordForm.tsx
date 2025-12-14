"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAddConfirmPasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { Field } from "../field/field";

interface ConfirmPasswordFormValues {
    new_password: string;
    confirm_password: string;
}

export const ConfirmPasswordForm: React.FC = () => {
    const { uidb64, token } = useParams(); // Route: /confirm-password/[uidb64]/[token]/
    const router = useRouter(); // useRouter from App Router

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ConfirmPasswordFormValues>();

    const [addConfirmPassword, { isLoading }] = useAddConfirmPasswordMutation();

    const onSubmit: SubmitHandler<ConfirmPasswordFormValues> = async (data) => {
        const { new_password, confirm_password } = data;

        if (new_password !== confirm_password) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            await addConfirmPassword({
                data: { new_password },
                uidb64,
                token,
            }).unwrap();

            reset();
            toast.success("Password reset successful!");
            router.push("/password-change-successful/"); // Navigation fix
        } catch (error: any) {
            const errorData = error?.data;

            // Backend validation errors
            if (errorData?.errors && typeof errorData.errors === "object") {
                const firstKey = Object.keys(errorData.errors)[0];
                const firstErrorMessage = errorData.errors[firstKey]?.[0];
                toast.error(firstErrorMessage);
            }
            // Generic detail message
            else if (errorData?.detail) {
                toast.error(errorData.detail);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    };

    const newPasswordValue = watch("new_password");

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <Field label="New Password" error={errors.new_password}>
                    <input
                        {...register("new_password", {
                            required: "New password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        type="password"
                        id="new_password"
                        placeholder="Enter new password"
                        className="w-full text-black placeholder:text-black text-sm md:text-base font-normal py-3 px-3.5 border border-black rounded-xl"
                    />
                </Field>
            </div>

            <div className="mb-4">
                <Field label="Confirm Password" error={errors.confirm_password}>
                    <input
                        {...register("confirm_password", {
                            required: "Confirm password is required",
                            validate: (value) =>
                                value === newPasswordValue || "Passwords do not match",
                        })}
                        type="password"
                        id="confirm_password"
                        placeholder="Re-enter new password"
                        className="w-full text-black placeholder:text-black text-sm md:text-base font-normal py-3 px-3.5 border border-black rounded-xl"
                    />
                </Field>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full text-base md:text-lg font-medium py-2.5 md:py-3.5 px-10 md:px-16 rounded bg-[#ED1B24] text-white disabled:opacity-50 cursor-pointer"
            >
                {isLoading ? "Sending..." : "Reset Password"}
            </button>
        </form>
    );
};
