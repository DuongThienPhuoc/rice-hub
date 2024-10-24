import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Dispatch, SetStateAction } from 'react';

export default function PaginationComponent({
    totalPages,
    currentPage,
    setCurrentPage,
}: {
    totalPages: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
}) {
    function renderPagination(currentPage: number, totalPage: number) {
        if (totalPage < 5) {
            return Array.from({ length: totalPage }, (_, index) => (
                <PaginationItem key={index}>
                    <PaginationLink
                        onClick={() => setCurrentPage(index)}
                        isActive={currentPage === index}
                    >
                        {index + 1}
                    </PaginationLink>
                </PaginationItem>
            ));
        } else if (currentPage > 3 && currentPage < totalPage - 2) {
            return (
                <>
                    <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(0)}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationEllipsis />
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink isActive>
                            {currentPage + 1}
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            {currentPage + 2}
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationEllipsis />
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(totalPage - 1)}
                        >
                            {totalPage}
                        </PaginationLink>
                    </PaginationItem>
                </>
            );
        } else if (
            currentPage === totalPage ||
            currentPage === totalPage - 1 ||
            currentPage === totalPage - 2
        ) {
            return (
                <>
                    <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(0)}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationEllipsis />
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(totalPage - 3)}
                            isActive={currentPage === totalPage - 3}
                        >
                            {totalPage - 2}
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(totalPage - 2)}
                            isActive={currentPage === totalPage - 2}
                        >
                            {totalPage - 1}
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(totalPage - 1)}
                            isActive={currentPage === totalPages - 1}
                        >
                            {totalPage}
                        </PaginationLink>
                    </PaginationItem>
                </>
            );
        } else {
            return (
                <>
                    {Array.from({ length: 5 }, (_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                onClick={() => setCurrentPage(index)}
                                isActive={currentPage === index}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationEllipsis />
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(totalPage - 1)}
                        >
                            {totalPage}
                        </PaginationLink>
                    </PaginationItem>
                </>
            );
        }
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className={
                            currentPage === 0
                                ? 'pointer-events-none opacity-50'
                                : ''
                        }
                    />
                </PaginationItem>
                {renderPagination(currentPage, totalPages)}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className={
                            currentPage === totalPages - 1
                                ? 'pointer-events-none opacity-50'
                                : ''
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
