const Skeleton = () => {
    return <>
        <section className="grid md:grid-cols-3 animate-pulse">
            <div className="md:col-span-1 bg-white p-4 rounded space-y-4">
                <div className="flex items-center justify-between gap-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </div>
                <div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
        </section>
        <div className="bg-white p-4 rounded animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="min-w-full divide-y divide-gray-300">
                <div className="grid grid-cols-5 divide-x divide-gray-300 py-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="grid grid-cols-5 divide-x divide-gray-300 py-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        </div>
    </>;
};

export default Skeleton;
