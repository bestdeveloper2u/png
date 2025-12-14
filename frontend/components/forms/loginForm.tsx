"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAddLoginMutation } from "@/redux/features/auth/authApi";
import { LoginPropsType } from "@/types/loginPropsType";
import { ReactIcons } from "@/utils/reactIcons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Field } from "../field/field";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LoginForm: React.FC = () => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginPropsType>();
    const [addLogin, { isLoading }] = useAddLoginMutation();
    const { IoMdEye, IoMdEyeOff } = ReactIcons;
    const router = useRouter();

    const onSubmitForm = async (formData: LoginPropsType) => {
        try {
            const response = await addLogin(formData).unwrap();
            reset();
            toast.success("Login successfully");
            const username = response.data?.user?.username;
            const role = response.data?.user.role;
            router.push(`/dashboard/${role === 'admin' ? 'admin' : 'contributor'}/${username}/`);
        } catch (error: any) {
            const errorData = error?.data;
            const errors = errorData?.errors;
            if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
                const firstKey = Object.keys(errors)[0];
                const firstErrorMessage = errors[firstKey]?.[0];
                toast.error(firstErrorMessage);
            } else {
                const fallbackMessage =
                    errorData?.detail ||
                    errorData?.message ||
                    error?.error ||
                    'Unable to login right now. Please try again.';
                toast.error(fallbackMessage);
            }
        }
    };

    return (
        <form
            className="flex flex-col flex-wrap gap-y-2.5 md:gap-y-5 w-full text-black pb-5"
            onSubmit={handleSubmit(onSubmitForm)}
        >
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                <Field label={"Enter your email"} error={errors.email}>
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Enter a valid email.",
                            },
                            minLength: {
                                value: 10,
                                message: "Email must be at least 10 characters",
                            },
                            maxLength: {
                                value: 40,
                                message: "Email must be at most 40 characters",
                            },
                        })}
                        className="text-black placeholder:text-black text-sm md:text-base font-normal placeholder:text-sm md:placeholder:text-base placeholder:font-normal py-3 px-2.5 md:px-3.5 border border-black rounded-xl"
                        type="email"
                        name="email"
                        id="email"
                        autoFocus
                        placeholder="Enter your email"
                    />
                </Field>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full relative">
                <Field label={"Enter your password"} error={errors.password}>
                    <div className="flex flex-col flex-wrap w-full relative">
                        <input
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 5,
                                    message: "Password must be at least 5 characters",
                                },
                                maxLength: {
                                    value: 15,
                                    message: "Password must be at most 15 characters",
                                },
                            })}
                            className="text-black placeholder:text-black text-sm md:text-base font-normal placeholder:text-sm md:placeholder:text-base placeholder:font-normal py-3 px-3.5 border border-black rounded-xl"
                            type={isShow ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="********"
                        />
                        <button
                            className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer z-50"
                            type="button"
                            onClick={() => setIsShow((prev) => !prev)}
                        >
                            {isShow ? (
                                <IoMdEyeOff className="text-black text-lg md:text-xl" />
                            ) : (
                                <IoMdEye className="text-black text-lg md:text-xl" />
                            )}
                        </button>
                    </div>
                </Field>
            </div>
            <div className="flex flex-row flex-wrap justify-between items-center w-full">
                <Link
                    className="text-xs md:text-base font-medium border-b sm:border-b-2 pb-0.5"
                    href={"/forgot-password/"}
                >
                    Forgot Password
                </Link>
                <Link
                    className="text-xs md:text-base font-medium border-b sm:border-b-2 pb-0.5 cursor-pointer"
                    href={"/user/register/"}
                >
                    Create New Account?
                </Link>
            </div>
            <div className="flex flex-col flex-wrap w-full">
                <button
                    className="bg-black text-white text-sm md:text-base font-medium px-10 py-3.5 rounded-xl cursor-pointer"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Login"}
                </button>
            </div>
        </form>
    );
};
