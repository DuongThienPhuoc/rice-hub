import React from 'react';
import Image from 'next/image';
import chevronRightIcon from '@/components/icon/chevron_right.svg';
import chevronLeftIcon from '@/components/icon/chevron_left.svg';

interface PagingProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Paging: React.FC<PagingProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const getVisiblePages = () => {
        const maxButtons = 5;
        const half = Math.floor(maxButtons / 2);
        let startPage, endPage;

        if (totalPages <= maxButtons) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= half) {
                startPage = 1;
                endPage = maxButtons;
            } else if (currentPage + half >= totalPages) {
                startPage = totalPages - maxButtons + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - half;
                endPage = currentPage + half;
            }
        }

        return { startPage, endPage };
    };

    const { startPage, endPage } = getVisiblePages();
    const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <div className='flex justify-center items-center'>
            <div className="flex bg-white justify-center rounded-full items-center my-4 py-2">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-3 rounded-lg mr-1 ml-5 bg-[#f5f5f7] hover:bg-gray-300"
                >
                    <Image src={chevronLeftIcon} alt='Previous' width={10} height={10} />
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageClick(1)}
                            className="px-4 py-2 mx-1 rounded-lg bg-[#f5f5f7] hover:bg-gray-300"
                        >
                            1
                        </button>
                        {startPage > 2 && (
                            <button className="px-4 py-2 mx-1 rounded-lg bg-[#f5f5f7] text-gray-400 cursor-not-allowed">...</button>
                        )}
                    </>
                )}

                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`px-4 py-2 mx-1 rounded-lg ${currentPage === page ? 'bg-[#1d1d1fca] text-white hover:bg-[#1d1d1f7e]' : 'bg-[#f5f5f7] hover:bg-gray-300'}`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <button className="px-4 py-2 mx-1 rounded-lg bg-[#f5f5f7] text-gray-400 cursor-not-allowed">...</button>
                        )}
                        <button
                            onClick={() => handlePageClick(totalPages)}
                            className="px-4 py-2 mx-1 rounded-lg bg-[#f5f5f7] hover:bg-gray-300"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-3 rounded-lg ml-1 mr-5 bg-[#f5f5f7] hover:bg-gray-300"
                >
                    <Image src={chevronRightIcon} alt='Next' width={10} height={10} />
                </button>
            </div>
        </div>
    );
};

export default Paging;
