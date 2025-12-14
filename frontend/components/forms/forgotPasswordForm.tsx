"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "react-hook-form";
import { Field } from "../field/field";
import { toast } from "react-toastify";
import { useAddForgotPasswordEmailMutation } from "../../redux/features/auth/authApi";

export const ForgotPasswordForm: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [addForgotPasswordEmail, { isLoading }] = useAddForgotPasswordEmailMutation();

    const onSubmitForm = async (formData: any) => {
        try {
            await addForgotPasswordEmail(formData).unwrap();
            reset()
            toast.success('Please check your email address!');
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
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="mb-4">
                <Field label=" Email Address" error={errors.email}>
                    <input
                        {...register("email", {
                            required: "Email is required"
                        })}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        className="w-full text-black placeholder:text-black text-sm md:text-base font-normal placeholder:text-sm md:placeholder:text-base placeholder:font-normal py-3 px-3.5 border border-black rounded-xl"
                        required
                    />
                </Field>
            </div>
            <button
                type="submit"
                className="w-full text-base md:text-lg font-medium py-2.5 md:py-3.5 px-10 md:px-16 rounded bg-[#ED1B24] text-white cursor-pointer"
            >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>
    );
}
