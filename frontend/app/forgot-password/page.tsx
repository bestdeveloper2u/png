import { ForgotPasswordForm } from "@/components/forms/forgotPasswordForm";
import Link from "next/link";

export default function ForgotPassword () {
    return (
        <section className="bg-[#0077A2] flex items-center justify-center min-h-screen">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full h-full flex items-center justify-center overflow-auto">
                <div className="bg-white rounded-lg p-6 shadow w-full lg:w-[30%]">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Forgot Password?
                        </h1>
                        <p className="mt-1 text-gray-500 text-sm">
                            Enter your email to reset password
                        </p>
                    </div>
                    <ForgotPasswordForm />
                    <div className="text-center mt-4 text-sm text-gray-600">
                        <p>
                            Know your password?{" "}
                            <Link href="/user/login/" className="text-purple-600 hover:underline">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
