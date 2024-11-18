/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import ProductList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ProductTable() {
    const { toast } = useToast();
    const router = useRouter();
    const columns = [
        { name: 'productCode', displayName: 'Mã nguyên liệu' },
        { name: 'productName', displayName: 'Tên nguyên liệu' },
        { name: 'price', displayName: 'Giá nhập (kg)' },
        { name: 'productQuantity', displayName: 'Tồn kho (kg)' },
        { name: 'importDate', displayName: 'Ngày nhập' },
        { name: 'supplierName', displayName: 'Nhà cung cấp' },
    ];
    const [loadingData, setLoadingData] = useState(true);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    const titles = [
        { name: '', displayName: '', type: '' },
    ];

    const getProducts = async (page?: number, search?: { field?: string, query?: string }) => {
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
            params.append("warehouseId", '1');
            const url = `/products/admin/products?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            if (data.page.totalElements === 0) {
                setProducts([]);
                toast({
                    variant: 'destructive',
                    title: 'Không tìm thấy nguyên liệu!',
                    description: 'Xin vui lòng thử lại',
                    duration: 3000,
                })
            } else {
                setProducts(data._embedded.adminProductDtoList);
            }
            setTotalPages(data.page.totalPages);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách nguyên liệu!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getProducts(currentPage, currentSearch);
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
                    <div className='p-5 bg-white rounded-lg'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="text" height={40} className='rounded-lg' />
                        ) : (
                            <div className='font-bold mb-5 text-[1.25rem]'>Nguyên liệu</div>
                        )}
                        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-5'>
                            <SearchBar
                                onSearch={handleSearch}
                                loadingData={loadingData}
                                selectOptions={[
                                    { value: 'productCode', label: 'Mã nguyên liệu' },
                                    { value: 'productName', label: 'Tên nguyên liệu' }
                                ]}
                            />
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                ) : (
                                    <Button onClick={() => router.push("/ingredients/create")} className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] bg-[#4ba94d] font-semibold hover:bg-green-500'>
                                        Thêm nguyên liệu
                                        <PlusIcon />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='overflow-hidden'>
                            <ProductList name="Sản phẩm" editUrl="/ingredients/updateIngredient" titles={titles} loadingData={loadingData} columns={columns} data={products} tableName="ingredients" />
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
            <FloatingButton />
        </div>
    );
};

