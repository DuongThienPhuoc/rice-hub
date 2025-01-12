'use client';
import { Button } from '@/components/ui/button';
import SupplierList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import PopupCreate from "@/components/popup/popupCreate";
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import SupplierPageBreadcrumb from '@/app/(admin)/suppliers/breadcrumb';

export default function SupplierTable() {
    const { toast } = useToast();
    const columns = [
        { name: 'id', displayName: 'Mã' },
        { name: 'name', displayName: 'Tên' },
        { name: 'contactPerson', displayName: 'Người liên hệ' },
        { name: 'email', displayName: 'Email' },
        { name: 'phoneNumber', displayName: 'Số điện thoại' },
        { name: 'address', displayName: 'Địa chỉ' },
    ];
    const [loadingData, setLoadingData] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: 'id', displayName: 'Mã', type: 'hidden' },
        { name: 'name', displayName: 'Tên', type: 'text' },
        { name: 'contactPerson', displayName: 'Người liên hệ', type: 'text' },
        { name: 'email', displayName: 'Email', type: 'text' },
        { name: 'phoneNumber', displayName: 'Số điện thoại', type: 'text' },
        { name: 'address', displayName: 'Địa chỉ', type: 'text' },
    ];

    const openPopup = () => setPopupVisible(true);
    const closeCreate = (reload?: boolean) => {
        setPopupVisible(false);
        if (reload == true) {
            setCurrentPage(1);
            setCurrentSearch({ field: '', query: '' });
        }
    }

    const closeEdit = (reload?: boolean) => {
        if (reload == true) {
            getSuppliers(currentPage, currentSearch);
        }
    }

    const getSuppliers = async (page?: number, search?: { field?: string, query?: string }) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const url = `/suppliers/getByFilter?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            if (data.page.totalElements === 0) {
                setSuppliers([]);
            } else {
                setSuppliers(data._embedded.supplierList);
            }
            setTotalPages(data.page.totalPages);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách nhà sản xuất!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };
    const { setBreadcrumb } = useBreadcrumbStore();

    useEffect(() => {
        setBreadcrumb(<SupplierPageBreadcrumb />);
        return () => setBreadcrumb(null);
    }, [setBreadcrumb]);

    useEffect(() => {
        getSuppliers(currentPage, currentSearch);
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
                                <div className='font-bold text-[1.25rem]'>Nhà sản xuất</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách nhà sản xuất
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-5'>
                            <SearchBar
                                onSearch={handleSearch}
                                loadingData={loadingData}
                                selectOptions={[
                                    { value: 'name', label: 'Tên nhà sản xuất' },
                                    { value: 'email', label: 'Email' },
                                    { value: 'phoneNumber', label: 'Số điện thoại' }
                                ]}
                            />
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                ) : (
                                    <Button onClick={openPopup} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] bg-[#4ba94d] font-semibold hover:bg-green-500'>
                                        Thêm nhà sản xuất
                                        <PlusIcon />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='overflow-hidden'>
                            <SupplierList name="Nhà sản xuất" editUrl="/suppliers/updateSupplier" titles={titles} loadingData={loadingData} columns={columns} data={suppliers} tableName="suppliers" handleClose={closeEdit} />
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
            {isPopupVisible && <PopupCreate tableName="Nhà sản xuất" url="/suppliers/createSupplier" titles={titles} handleClose={closeCreate} />}
            <FloatingButton />
        </div>
    );
};

