"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAddChangePasswordMutation } from "@/redux/features/auth/authApi";
import { ReactIcons } from "@/utils/reactIcons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Field } from "../field/field";

export const ChangePasswordForm:React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [addChangePassword] = useAddChangePasswordMutation();

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { IoMdEye, IoMdEyeOff } = ReactIcons;

    const onSubmit = async (data: any) => {
        if (data.new_password !== data.confirm_password) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            await addChangePassword(data).unwrap();
            reset();
            toast.success("Password changed successfully!");
        } catch (error: any) {
            toast.error("Failed to change password.");
            console.log(error.message);
        }
    };

    const renderEyeIcon = (show: boolean, toggle: () => void) => (
        <span
            onClick={toggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        >
            {show ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </span>
    );

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl w-auto mx-auto p-4 space-y-4 bg-white shadow-md rounded-2xl sm:p-6"
        >
            <h2 className="text-xl font-semibold text-center text-gray-800">
                Change Password
            </h2>

            {/* Old Password */}
            <Field label="Old Password" error={errors.old_password}>
                <div className="relative">
                    <input
                        {...register("old_password", {
                            required: "Old password is required",
                        })}
                        type={showOld ? "text" : "password"}
                        id="old_password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    {renderEyeIcon(showOld, () => setShowOld(!showOld))}
                </div>
            </Field>

            {/* New Password */}
            <Field label="New Password" error={errors.new_password}>
                <div className="relative">
                    <input
                        {...register("new_password", {
                            required: "New password is required",
                        })}
                        type={showNew ? "text" : "password"}
                        id="new_password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    {renderEyeIcon(showNew, () => setShowNew(!showNew))}
                </div>
            </Field>

            {/* Confirm Password */}
            <Field label="Confirm Password" error={errors.confirm_password}>
                <div className="relative">
                    <input
                        {...register("confirm_password", {
                            required: "Confirm password is required",
                        })}
                        type={showConfirm ? "text" : "password"}
                        id="confirm_password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    {renderEyeIcon(showConfirm, () => setShowConfirm(!showConfirm))}
                </div>
            </Field>

            <div className="pt-2">
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
