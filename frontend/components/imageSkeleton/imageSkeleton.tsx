export const ImageSkeleton: React.FC = () => {
    return (
        <div className="block w-full h-full relative rounded-2xl border border-gray-300 shadow-sm overflow-hidden animate-pulse bg-gray-200">
            <div className="w-full h-full bg-gray-300"></div>
        </div>
    );
};
