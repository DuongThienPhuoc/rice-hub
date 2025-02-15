'use client';

import { Button } from '@/components/ui/button';
import EmployeeList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import CustomerPageBreadcrumb from '@/app/(admin)/customers/breadcrumb';

export default function CustomerTable() {
    const { toast } = useToast();
    const router = useRouter();
    const [onPageChange, setOnPageChange] = useState(false);
    const columns = [
        { name: 'fullName', displayName: 'Tên khách hàng' },
        { name: 'email', displayName: 'Email' },
        { name: 'phone', displayName: 'Số điện thoại' },
        { name: 'address', displayName: 'Địa chỉ' },
        { name: 'createAt', displayName: 'Ngày tạo' },
        { name: 'updateAt', displayName: 'Ngày sửa' },
        { name: 'active', displayName: 'Trạng thái' },
    ];
    const [loadingData, setLoadingData] = useState(true);
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
            if (data.page.totalElements === 0) {
                setCustomers([]);
            } else {
                setCustomers(data._embedded.customerList);
            }
            setTotalPages(data.page.totalPages);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách khách hàng!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };
    const { setBreadcrumb } = useBreadcrumbStore();

    useEffect(() => {
        setBreadcrumb(<CustomerPageBreadcrumb />)

        return () => {
            setBreadcrumb(null)
        }
    }, [setBreadcrumb]);

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
        <div className='mx-5'>
            <section className='col-span-4'>
                <div className='overflow-x-auto w-full'>
                    <div className='p-5 bg-white rounded-lg'>
                        {loadingData ? (
                            <div className='mb-5'>
                                <Skeleton animation="wave" variant="text" height={40} width={100} className='rounded-lg' />
                                <Skeleton animation="wave" variant="text" height={30} width={200} className='rounded-lg' />
                            </div>
                        ) : (
                            <div className="space-y-2 mb-5">
                                <div className='font-bold text-[1.25rem]'>Khách hàng</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách khách hàng
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-5'>
                            <SearchBar
                                onSearch={handleSearch}
                                loadingData={loadingData}
                                selectOptions={[
                                    { value: 'fullName', label: 'Tên khách hàng' },
                                    { value: 'email', label: 'Địa chỉ email' },
                                    { value: 'phone', label: 'Số điện thoại' }
                                ]}
                            />
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                ) : (
                                    <Button onClick={() => {
                                        router.push("/customers/create")
                                        setOnPageChange(true);
                                    }} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] bg-[#4ba94d] font-semibold hover:bg-green-500'>
                                        Thêm khách hàng
                                        <PlusIcon />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='overflow-hidden'>
                            <EmployeeList name="Nhân viên" editUrl="/customers/updateCustomer" titles={titles} loadingData={loadingData} columns={columns} data={customers} tableName="customers" handleClose={() => getCustomers(currentPage, currentSearch)} />
                        </div>
                        {totalPages > 1 && (
                            <Paging
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </section>
            {onPageChange === true && (
                <div className='fixed z-[1000] top-0 left-0 bg-black bg-opacity-40 w-full'>
                    <div className='flex'>
                        <div className='w-full h-[100vh]'>
                            <LinearIndeterminate />
                        </div>
                    </div>
                </div>
            )}
            <FloatingButton />
        </div>
    );
};
