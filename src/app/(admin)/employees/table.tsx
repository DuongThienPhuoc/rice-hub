'use client';
import { Button } from '@/components/ui/button';
import EmployeeList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "../../../api/axiosConfig";
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';

export default function EmployeeTable() {
    const router = useRouter();
    const columns = [
        { name: 'employeeCode', displayName: 'Mã nhân viên' },
        { name: 'fullName', displayName: 'Tên nhân viên' },
        { name: 'email', displayName: 'Email' },
        { name: 'phone', displayName: 'Số điện thoại' },
        { name: 'address', displayName: 'Địa chỉ' },
        { name: 'joinDate', displayName: 'Ngày vào làm' },
    ];
    const [loadingData, setLoadingData] = useState(true);
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
        setLoadingData(true);
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
            console.error("Lỗi khi lấy danh sách nhân viên:", error);
        } finally {
            setLoadingData(false);
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
                                { value: 'employeeCode', label: 'Mã nhân viên' },
                                { value: 'fullName', label: 'Tên nhân viên' },
                                { value: 'phoneNumber', label: 'Số điện thoại' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            <Button onClick={() => router.push("/employees/create")} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                Thêm nhân viên
                                <PlusIcon />
                            </Button>
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <EmployeeList name="Nhân viên" editUrl="/employees/updateEmployee" loadingData={loadingData} titles={titles} columns={columns} data={employees} tableName="employees" />
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
