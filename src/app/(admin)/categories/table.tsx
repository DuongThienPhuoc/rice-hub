/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import CategoryList from "@/components/list/list";
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
import CategoryPageBreadcrumb from '@/app/(admin)/categories/breadcrumb';

export default function CategoryTable() {
    const { setBreadcrumb } = useBreadcrumbStore();
    const { toast } = useToast();
    const [loadingData, setLoadingData] = useState(true);
    const columns = [
        { name: 'id', displayName: 'Mã' },
        { name: 'name', displayName: 'Tên danh mục' },
        { name: 'description', displayName: 'Mô tả chi tiết' },
    ];
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const [isPopupVisible, setPopupVisible] = useState(false);
    const titles = [
        { name: 'id', displayName: 'Mã danh mục', type: 'hidden' },
        { name: 'name', displayName: 'Tên danh mục', type: 'text' },
        { name: 'description', displayName: 'Mô tả chi tiết', type: 'textArea' },
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
            getCategories(currentPage, currentSearch);
        }
    }

    const getCategories = async (page?: number, search?: { field?: string, query?: string }) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            const url = `/categories/getByFilter?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            if (data.page.totalElements === 0) {
                setCategories([]);
            } else {
                setCategories(data._embedded.categoryList);
            }
            setTotalPages(data.page.totalPages);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách danh mục!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getCategories(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

    useEffect(() => {
        setBreadcrumb(<CategoryPageBreadcrumb />)
        return () => setBreadcrumb(null);
    }, [setBreadcrumb]);

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
                                <div className='font-bold text-[1.25rem]'>Danh mục</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách danh mục
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-5'>
                            <SearchBar
                                onSearch={handleSearch}
                                loadingData={loadingData}
                                selectOptions={[
                                    { value: 'name', label: 'Tên danh mục' },
                                ]}
                            />
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                ) : (
                                    <Button onClick={openPopup} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] bg-[#4ba94d] font-semibold hover:bg-green-500'>
                                        Thêm danh mục
                                        <PlusIcon />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='overflow-x-auto'>
                            <CategoryList name="Danh mục" editUrl="/categories/updateCategory" titles={titles} columns={columns} data={categories} tableName="categories" loadingData={loadingData} handleClose={closeEdit} />
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
            </section >
            {isPopupVisible && <PopupCreate tableName="Danh mục" url="/categories/createCategory" titles={titles} handleClose={closeCreate} />}
            <FloatingButton />
        </div >
    );
};
