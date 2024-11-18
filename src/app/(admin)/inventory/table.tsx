'use client';
import { Button } from '@/components/ui/button';
import InventoryList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@mui/material';

export default function InventoryTable() {
    const router = useRouter();
    const columns = [
        { name: 'id', displayName: 'Mã sản phẩm' },
        { name: 'name', displayName: 'Tên sản phẩm' },
        { name: 'unit', displayName: 'Đơn vị' },
        { name: 'order', displayName: 'Số lượng' },
        { name: 'batch', displayName: 'Lô hàng' },
        { name: 'status', displayName: 'Trạng thái' },
    ];
    const [loadingData, setLoadingData] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: '', displayName: '', type: '' },
    ];

    const getInventory = async (page?: number, search?: { field?: string, query?: string }) => {
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
            setInventory(data._embedded.employeeList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu thu:", error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getInventory(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='mx-5'>
            <section className='col-span-4'>
                <div className='w-full overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            loadingData={loadingData}
                            selectOptions={[
                                { value: 'id', label: 'Mã phiếu' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                            {loadingData ? (
                                <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                            ) : (
                                <Button onClick={() => router.push("/inventory/create")} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    Thêm phiếu kiểm kho
                                    <PlusIcon />
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <InventoryList name="Phiếu thu" editUrl="/inventory/updateIncome" loadingData={loadingData} titles={titles} columns={columns} data={inventory} tableName="inventory" />
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

