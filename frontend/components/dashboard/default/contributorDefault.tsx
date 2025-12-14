"use client";

import { useGetUserApprovedImagesLengthQuery } from "@/redux/features/images/approvedApi";
import { useGetAllContributorDownloadQuery } from "@/redux/features/images/downloadApi";
import { useGetUserPendingImagesLengthQuery } from "@/redux/features/images/pendingApi";
import { useGetUserRejectedImagesLengthQuery } from "@/redux/features/images/rejectedApi";
import { useGetUserTotalImagesLengthQuery } from "@/redux/features/images/totalApi";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { useSelector } from "react-redux";


export default function ContributorDefault() {
    const auth = useSelector((state: RootState) => state.auth);
    const username = auth?.user?.username;

    const {
        data: totalImages,
        isLoading: totalLoading,
        isError: totalError,
    } = useGetUserTotalImagesLengthQuery(undefined, { refetchOnMountOrArgChange: true });

    const {
        data: approvedImages,
        isLoading: approvedLoading,
        isError: approvedError,
    } = useGetUserApprovedImagesLengthQuery(undefined, { refetchOnMountOrArgChange: true });

    const {
        data: pendingImages,
        isLoading: pendingLoading,
        isError: pendingError,
    } = useGetUserPendingImagesLengthQuery(undefined, { refetchOnMountOrArgChange: true });

    const {
        data: rejectedImages,
        isLoading: rejectedLoading,
        isError: rejectedError,
    } = useGetUserRejectedImagesLengthQuery(undefined, { refetchOnMountOrArgChange: true });

    const { data: all_download } = useGetAllContributorDownloadQuery(undefined, { refetchOnMountOrArgChange: true });

    const renderValue = (loading: boolean, error: boolean, value: number | undefined) => {
        return (
            <div className="flex flex-col flex-wrap min-h-[1.5rem]">
                {loading ? (
                    <div className="w-5 h-5 border-2 border-t-white border-l-white border-b-transparent border-r-transparent rounded-full animate-spin"></div>
                ) : error ? (
                    <span>Error!</span>
                ) : (
                    <span>{value ?? 0}</span>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col flex-wrap items-center justify-center space-y-5 lg:space-y-20 px-2.5 md:px-5 xl:px-10 w-full h-[82%]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 lg:gap-20 py-2.5 lg:py-10 px-2.5 lg:px-8 w-full rounded-sm bg-[#F4F3F9]">
                <Link
                    className="flex flex-row flex-wrap justify-between bg-[#0F1932] text-white py-5 lg:py-10 px-2.5 lg:px-8 rounded-sm"
                    href={`/dashboard/contributor/${username}/total-images/`}
                >
                    <div className="flex flex-col flex-wrap gap-y-1">
                        <span className="text-sm sm:text-base xl:text-lg font-semibold">Total Images</span>
                        {renderValue(totalLoading, totalError, totalImages?.images_length)}
                    </div>
                    <div className="flex flex-col flex-wrap gap-y-1">
                        <span className="text-sm sm:text-base xl:text-lg font-semibold">All Downloads</span>
                        <span>{all_download?.total_downloads}</span>
                    </div>
                </Link>
                <Link
                    className="bg-[#B36F30] text-white py-5 lg:py-10 px-2.5 lg:px-8 rounded-sm"
                    href={`/dashboard/contributor/${username}/pending-images/`}
                >
                    <div className="flex flex-col flex-wrap gap-y-1">
                        <span className="text-sm sm:text-base xl:text-lg font-semibold">Pending Images</span>
                        {renderValue(pendingLoading, pendingError, pendingImages?.images_length)}
                    </div>
                </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 lg:gap-20 py-2.5 lg:py-10 px-2.5 lg:px-8 w-full rounded-sm bg-[#F4F3F9]">
                <Link
                    className="bg-[#1D8B4E] text-white py-5 lg:py-10 px-2.5 lg:px-8 rounded-sm"
                    href={`/dashboard/contributor/${username}/approved-images/`}
                >
                    <div className="flex flex-col flex-wrap gap-y-1">
                        <span className="text-sm sm:text-base xl:text-lg font-semibold">Approved Images</span>
                        {renderValue(approvedLoading, approvedError, approvedImages?.images_length)}
                    </div>
                </Link>
                <Link
                    className="bg-[#AA2F27] text-white py-5 lg:py-10 px-2.5 lg:px-8 rounded-sm"
                    href={`/dashboard/contributor/${username}/rejected-images/`}
                >
                    <div className="flex flex-col flex-wrap gap-y-1">
                        <span className="text-sm sm:text-base xl:text-lg font-semibold">Rejected Images</span>
                        {renderValue(rejectedLoading, rejectedError, rejectedImages?.images_length)}
                    </div>
                </Link>
            </div>
        </div>
    );
}
