'use client';

import { Button } from '@/components/ui/button';
import ImportList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
// import RadioFilter from "@/components/filter/radioFilter";
// import CheckboxFilter from "@/components/filter/checkboxFilter";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import { useRouter } from 'next/navigation';

export default function ExportTable() {
    const router = useRouter();
    const columns = [
        { name: 'id', displayName: 'Mã phiếu' },
        { name: 'type', displayName: 'Lý do xuất hàng' },
        { name: 'time', displayName: 'Ngày xuất' },
        { name: 'order', displayName: 'Đơn hàng' },
        { name: 'batch', displayName: 'Người nhận hàng' },
        { name: 'status', displayName: 'Trạng thái' },
    ];
    const [employees, setEmployees] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: '', displayName: '', type: '' },
    ];

    const getEmployees = async (page?: number, search?: { field?: string, query?: string }) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const url = `/employees/?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            setEmployees(data._embedded.employeeList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu xuất kho:", error);
        }
    };

    useEffect(() => {
        getEmployees(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <section className='col-span-4'>
                <div className='w-full overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            selectOptions={[
                                { value: 'id', label: 'Mã phiếu' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            <Button onClick={() => router.push("/expenditures/create")} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Tạo phiếu xuất kho
                            </Button>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Import
                            </Button>
                            <Button className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Xuất file
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <ImportList name="Phiếu chi" editUrl="/expenditures/updateExpenditure" titles={titles} columns={columns} data={employees} tableName="expenditures" />
                    </div>
                    {totalPages > 1 && (
                        <Paging
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
                <div style={{ flex: '1' }}></div>
            </section>
            <FloatingButton />
        </div>
    );
};

