import React from "react";

export const LoadingComponent: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-[#FBFAFF]">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-xl text-gray-700">Loading...</p>
            </div>
        </div>
    );
}
