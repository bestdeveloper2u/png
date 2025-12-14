/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactIcons } from "@/utils/reactIcons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Field } from "../field/field";
import Link from "next/link";
import { useAddRegisterMutation } from "@/redux/features/auth/authApi";
import { RegisterPropsType } from "@/types/registerPropsType";
import { useRouter } from "next/navigation";

export const RegisterForm: React.FC = () => {
    const {register,handleSubmit,reset,formState: { errors }} = useForm<RegisterPropsType>();
    const [addRegister, { isLoading }] = useAddRegisterMutation();
    const [show, setShow] = useState({ password: false, confirm: false });
    const router = useRouter();
    const { IoMdEye, IoMdEyeOff } = ReactIcons;

    const toggleVisibility = (field: "password" | "confirm") => {
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const onSubmitForm = async (formData: RegisterPropsType) => {
        try {
            await addRegister(formData).unwrap();
            toast.success("Register successfully");
            reset();
            router.push("/user/login"); 
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

    return (
        <form
            className="flex flex-col flex-wrap gap-y-2.5 md:gap-y-5 w-full text-black pb-5"
            onSubmit={handleSubmit(onSubmitForm)}
        >
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                <Field label={"Enter your username"} error={errors.username}>
                    <input
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message: "Username must be at least 3 characters",
                            },
                            maxLength: {
                                value: 40,
                                message: "Username must be at most 40 characters",
                            },
                        })}
                        className="text-black placeholder:text-black text-sm md:text-base font-normal placeholder:text-sm md:placeholder:text-base placeholder:font-normal py-3 px-2.5 md:px-3.5 border border-black rounded-xl"
                        type="text"
                        name="username"
                        id="username"
                        autoFocus
                        placeholder="Enter your username"
                    />
                </Field>
            </div>
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
                        placeholder="Enter your email"
                    />
                </Field>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                <Field label={"Enter your number"} error={errors.number}>
                    <input
                        {...register("number", {
                            required: "Number is required",
                            minLength: {
                                value: 11,
                                message: "Number must be at least 10 characters",
                            },
                            maxLength: {
                                value: 20,
                                message: "Number must be at most 40 characters",
                            },
                        })}
                        className="text-black placeholder:text-black text-sm md:text-base font-normal placeholder:text-sm md:placeholder:text-base placeholder:font-normal py-3 px-2.5 md:px-3.5 border border-black rounded-xl"
                        type="text"
                        name="number"
                        id="number"
                        placeholder="Enter your number"
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
                            type={show.password ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="********"
                        />
                        <button
                            className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer z-50"
                            type="button"
                            onClick={() => toggleVisibility("password")}
                        >
                            {show.password ? (
                                <IoMdEyeOff className="text-black text-lg md:text-xl" />
                            ) : (
                                <IoMdEye className="text-black text-lg md:text-xl" />
                            )}
                        </button>
                    </div>
                </Field>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full relative">
                <Field
                    label={"Enter your confirm password"}
                    error={errors.confirm_password}
                >
                    <div className="flex flex-col flex-wrap w-full relative">
                        <input
                            {...register("confirm_password", {
                                required: "Confirm password is required",
                                minLength: {
                                    value: 5,
                                    message: "Confirm password must be at least 5 characters",
                                },
                                maxLength: {
                                    value: 15,
                                    message: "Confirm password must be at most 15 characters",
                                },
                            })}
                            className="text-black placeholder:text-black text-sm md:text-base font-normal placeholder:text-sm md:placeholder:text-base placeholder:font-normal py-3 px-3.5 border border-black rounded-xl"
                            type={show.confirm ? "text" : "password"}
                            name="confirm_password"
                            id="confirm_password"
                            placeholder="********"
                        />
                        <button
                            className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer z-50"
                            type="button"
                            onClick={() => toggleVisibility("confirm")}
                        >
                            {show.confirm ? (
                                <IoMdEyeOff className="text-black text-lg md:text-xl" />
                            ) : (
                                <IoMdEye className="text-black text-lg md:text-xl" />
                            )}
                        </button>
                    </div>
                </Field>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                <Field label={""} error={errors.terms_accepted}>
                    <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-y-2.5 md:gap-y-0 w-full">
                        <div className="flex flex-row items-center gap-x-2">
                            <input
                                {...register("terms_accepted", {
                                    required: "You must accept the terms and conditions",
                                })}
                                className="w-4 h-4 rounded"
                                type="checkbox"
                                id="terms_accepted"
                            />
                            <span className="text-sm sm:text-sm md:text-base">
                                I agree to the{" "}
                                <Link className="text-blue-500 font-medium underline" href="/">
                                    Terms & Conditions
                                </Link>
                            </span>
                        </div>
                        <button
                            className="text-sm md:text-base font-medium border-b-2 pb-0.5 cursor-pointer"
                            type="button"
                        >
                            Already have an account?
                        </button>
                    </div>
                </Field>
            </div>
            <div className="flex flex-col flex-wrap w-full">
                <button
                    className="bg-black text-white text-sm md:text-base font-medium px-10 py-3.5 rounded-xl cursor-pointer"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Register"}
                </button>
            </div>
        </form>
    );
}
