import React from "react";

interface ErrorProps {
    error: string;
}

export const ErrorComponent: React.FC<ErrorProps> = ( { error }) => {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-[#FBFAFF]">
            <div className="flex flex-col items-center px-4">
                <svg
                    className="w-16 h-16 text-red-500 mb-4 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                </svg>
                <h1 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h1>
                <p className="text-center text-gray-700">{error}</p>
            </div>
        </div>
    );
}
