"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAddAdminProfileChangeMutation, useAddUsersQuery, useGetUserDownloadCountQuery } from "@/redux/features/auth/authApi";
import { useState } from "react";

export default function Users() {
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, refetch } = useAddUsersQuery(
        { page },
        { refetchOnMountOrArgChange: true }
    );

    const { data: downloadCountData } = useGetUserDownloadCountQuery(undefined, { refetchOnMountOrArgChange: true });

    const [addAdminProfileChange] = useAddAdminProfileChangeMutation();

    const handleToggleBlock = async (user: any) => {
        try {
            await addAdminProfileChange({
                id: user.id,
                is_active: !user.is_active,
                is_block: user.is_active,
            }).unwrap();

            refetch();
        } catch (error) {
            console.error("Failed to update user status:", error);
        }
    };

    if (isLoading) return <p className="text-center mt-10">Loading users...</p>;
    if (isError) return <p className="text-center mt-10 text-red-500">Error loading users.</p>;

    // downloadCount lookup object keyed by user_id
    const downloadCountMap: Record<number, number> = {};
    downloadCountData?.users?.forEach((u: any) => {
        downloadCountMap[u.id] = u.total_downloads;
    });

    return (
        <div className="px-5 py-5">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">User List</h2>

            {data?.results?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data.results.map((user: any, index: number) => (
                        <div
                            key={user.user_id || user.slug || `${user.id}-${index}`}
                            className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
                        >
                            <button
                                type="button"
                                onClick={() => handleToggleBlock(user)}
                                className={`mb-4 cursor-pointer px-3 py-1 rounded text-sm font-semibold transition
                                    ${user.is_active ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"}
                                `}
                            >
                                {user.is_active ? "Block" : "Unblock"}
                            </button>

                            <div className="flex flex-col flex-wrap justify-center items-center py-2.5 px-2.5 w-full">
                                <span className="text-sm sm:text-base xl:text-lg font-semibold">Downloads</span>
                                <span>{downloadCountMap[user.id] || 0}</span>
                            </div>

                            <div className="mb-2">
                                <p className="text-xs text-gray-400">#{(page - 1) * 10 + index + 1}</p>
                                <h3 className="text-sm font-bold text-gray-800">{user.username || "N/A"}</h3>
                                <p className="text-[13px] text-gray-500">{user.email || "N/A"}</p>
                            </div>

                            <div className="text-[12px] space-y-1 text-gray-600">
                                <p><span className="font-medium">User ID:</span> {user.user_id}</p>
                                <p><span className="font-medium">Phone:</span> {user.number || "N/A"}</p>
                                <p><span className="font-medium">Role:</span> {user.role || "N/A"}</p>
                                <p><span className="font-medium">Gender:</span> {user.gender || "N/A"}</p>
                                <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {user.is_active ? "active" : "inactive"}
                                    </span>
                                </p>
                                <p><span className="font-medium">Joined:</span> {new Date(user.date_joined).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-10">No users found.</p>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 gap-4 flex-wrap">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={!data?.previous}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 cursor-pointer rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm font-medium">Page {page}</span>

                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!data?.next}
                    className="px-4 py-2 text-sm cursor-pointer bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
