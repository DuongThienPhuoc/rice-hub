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
import { Separator } from '@/components/ui/separator';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import ProductPageBreadcrumb from '@/app/(admin)/products/breadcrumb';

export default function ProductTable() {
    const { toast } = useToast();
    const router = useRouter();
    const { setBreadcrumb } = useBreadcrumbStore();
    const [onPageChange, setOnPageChange] = useState(false);
    const columns = [
        { name: 'productCode', displayName: 'Mã sản phẩm' },
        { name: 'productName', displayName: 'Tên sản phẩm' },
        { name: 'categoryName', displayName: 'Danh mục' },
        { name: 'supplierName', displayName: 'Nhà cung cấp' },
        { name: 'price', displayName: 'Giá nhập (kg)' },
        { name: 'importDate', displayName: 'Ngày tạo' },
        { name: 'updateAt', displayName: 'Ngày sửa' },
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
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            params.append("warehouseId", '2');
            const url = `/products/admin/products?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            if (data.page.totalElements === 0) {
                setProducts([]);
                toast({
                    variant: 'destructive',
                    title: 'Không tìm thấy sản phẩm!',
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
                title: 'Lỗi khi lấy danh sách sản phẩm!',
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

    useEffect(() => {
        setBreadcrumb(<ProductPageBreadcrumb />)
        return () => setBreadcrumb(null);
    }, [setBreadcrumb]);

    return (
        <div className='mx-5'>
            <section className='col-span-4'>
                <div className='w-full overflow-x-auto'>
                    <div className='p-5 bg-white rounded-lg'>
                        {loadingData ? (
                            <div className='mb-5'>
                                <Skeleton animation="wave" variant="text" height={40} width={100} className='rounded-lg' />
                                <Skeleton animation="wave" variant="text" height={30} width={200} className='rounded-lg' />
                            </div>
                        ) : (
                            <div className="space-y-2 mb-5">
                                <div className='font-bold text-[1.25rem]'>Sản phẩm</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách sản phẩm
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-5'>
                            <SearchBar
                                onSearch={handleSearch}
                                loadingData={loadingData}
                                selectOptions={[
                                    { value: 'productName', label: 'Tên sản phẩm' },
                                    { value: 'productCode', label: 'Mã sản phẩm' },
                                ]}
                            />
                            <div className='flex flex-col lg:flex-row items-center mt-0'>
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                ) : (
                                    <Button onClick={() => {
                                        router.push("/products/create")
                                        setOnPageChange(true);
                                    }} className='ml-0 mt-4 lg:ml-2 lg:mt-0 px-3 py-3 text-[14px] bg-[#4ba94d] font-semibold hover:bg-green-500'>
                                        Thêm sản phẩm
                                        <PlusIcon />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='overflow-hidden'>
                            <ProductList name="Sản phẩm" editUrl="/products/updateProduct" titles={titles} loadingData={loadingData} columns={columns} data={products} tableName="products" handleClose={() => getProducts(currentPage, currentSearch)} />
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

