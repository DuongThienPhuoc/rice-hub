'use client';

import { Button } from '@/components/ui/button';
import EmployeeList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import { useRouter } from 'next/navigation';

export default function CustomerTable() {
    const router = useRouter();
    const columns = [
        { name: 'fullName', displayName: 'Tên khách hàng' },
        { name: 'email', displayName: 'Email' },
        { name: 'phone', displayName: 'Số điện thoại' },
        { name: 'address', displayName: 'Địa chỉ' },
        { name: 'active', displayName: 'Trạng thái' },
        { name: '', displayName: '' },
    ];
    const [customers, setCustomers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: '', displayName: '', type: '' },
    ];

    const getCustomers = async (page?: number, search?: { field?: string, query?: string }) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const url = `/customer/?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            setCustomers(data._embedded.customerList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
        }
    };

    useEffect(() => {
        getCustomers(currentPage, currentSearch);
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
                <div className='overflow-x-auto w-full'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            selectOptions={[
                                { value: 'fullName', label: 'Tên khách hàng' },
                                { value: 'email', label: 'Địa chỉ email' },
                                { value: 'phone', label: 'Số điện thoại' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            <Button onClick={() => router.push("/customers/create")} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm khách hàng
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
                        <EmployeeList name="Nhân viên" editUrl="/customers/updateCustomer" titles={titles} columns={columns} data={customers} tableName="customers" />
                    </div>
                    {totalPages > 1 && (
                        <Paging
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </section>
            <FloatingButton />
        </div>
    );
};
