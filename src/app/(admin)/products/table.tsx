/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import ProductList from "@/components/list/list";
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import api from "@/config/axiosConfig";
import { Check, CirclePlus, PlusIcon, Search, X } from 'lucide-react';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import ProductPageBreadcrumb from '@/app/(admin)/products/breadcrumb';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Category, getCategories } from '@/data/category';
import { Supplier } from '@/type/order';
import { getSuppliers } from '@/data/supplier';

export default function ProductTable() {
    const { toast } = useToast();
    const router = useRouter();
    const { setBreadcrumb } = useBreadcrumbStore();
    const [onPageChange, setOnPageChange] = useState(false);
    const columns = [
        { name: 'productCode', displayName: 'Mã sản phẩm' },
        { name: 'productName', displayName: 'Tên sản phẩm' },
        { name: 'categoryName', displayName: 'Danh mục' },
        { name: 'supplierName', displayName: 'Nhà sản xuất' },
        { name: 'importDate', displayName: 'Ngày tạo' },
        { name: 'updateAt', displayName: 'Ngày sửa' },
    ];
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [productSupplier, setProductSupplier] = useState<Supplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [productCategories, setProductCategories] = useState<Category[]>([]);
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

    async function fetchCategories() {
        try {
            const response = await getCategories<Category[]>();
            setProductCategories(response);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(`An error occurred while fetching categories: ${e.message}`)
            }
            throw new Error('An error occurred while fetching categories')
        }
    }

    async function fetchSuppliers() {
        try {
            const response = await getSuppliers<Supplier[]>();
            setProductSupplier(response);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(`An error occurred while fetching supplier: ${e.message}`)
            }
            throw new Error('An error occurred while fetching supplier')
        }
    }

    const getProducts = async (page?: number, search?: { field?: string, query?: string }, category?: Category | null, supplier?: Supplier | null) => {
        try {
            const params = new URLSearchParams();
            params.append("pageSize", "10");
            if (page) {
                params.append("pageNumber", page.toString());
            }
            if (search?.field && search?.query) {
                params.append(search.field, search.query);
            }
            if (category) {
                params.append("categoryId", category.id.toString());
            }
            if (supplier) {
                params.append("supplierId", supplier.id.toString());
            }
            params.append("warehouseId", '2');
            const url = `/products/admin/products?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            if (data.page.totalElements === 0) {
                setProducts([]);
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
        getProducts(currentPage, currentSearch, selectedCategory, selectedSupplier);
    }, [currentPage, currentSearch, selectedCategory, selectedSupplier]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    useEffect(() => {
        fetchCategories()
            .catch((e) => console.error(e));
        fetchSuppliers()
            .catch((e) => console.error(e));
    }, []);

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
                            <div className='flex lg:space-y-0 space-y-2 lg:space-x-2 lg:flex-row flex-col'>
                                <SearchBar
                                    onSearch={handleSearch}
                                    loadingData={loadingData}
                                    selectOptions={[
                                        { value: 'productName', label: 'Tên sản phẩm' },
                                        { value: 'productCode', label: 'Mã sản phẩm' },
                                    ]}
                                />
                                {loadingData ? (
                                    <>
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                    </>
                                ) : (
                                    <>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="h-[38px] px-5 rounded-md border border-[#4ba94d] bg-[#4ba94d] flex items-center gap-1 hover:cursor-pointer">
                                                    <CirclePlus className="h-4 w-4 text-white" />
                                                    <span className="text-sm font-semibold text-white">
                                                        Danh mục
                                                    </span>
                                                    {selectedCategory !== null && (
                                                        <>
                                                            <Separator
                                                                orientation="vertical"
                                                                className="h-4 mx-2"
                                                            />
                                                            <div className="h-auto text-sm font-medium leading-none bg-[#f4f4f5] px-[4px] py-[5px] rounded-md  items-center inline-flex whitespace-nowrap">
                                                                {selectedCategory?.name}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                align="start"
                                                className="p-0 w-50"
                                            >
                                                <div className="p-2 border-b">
                                                    <div className="relative">
                                                        <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <input
                                                            type="text"
                                                            className="pl-6 h-full rounded outline-0 focus:outline-0"
                                                            placeholder="Danh mục"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-2">
                                                    <ul>
                                                        {productCategories?.map(
                                                            (category, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="relative flex items-center gap-x-1 hover:bg-gray-100 p-2 rounded-lg hover:cursor-pointer text-sm font-medium"
                                                                    onClick={() => {
                                                                        setCurrentPage(1);
                                                                        setSelectedCategory(
                                                                            category
                                                                        );
                                                                    }}
                                                                >
                                                                    {selectedCategory ===
                                                                        category && (
                                                                            <Check className="h-4 w-4 absolute left-2" />
                                                                        )}
                                                                    <span className="pl-5">
                                                                        {category.name}
                                                                    </span>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="h-[38px] px-5 rounded-md border border-[#4ba94d] bg-[#4ba94d] flex items-center gap-1 hover:cursor-pointer">
                                                    <CirclePlus className="h-4 w-4 text-white" />
                                                    <span className="text-sm font-semibold text-white">
                                                        Nhà sản xuất
                                                    </span>
                                                    {selectedSupplier !== null && (
                                                        <>
                                                            <Separator
                                                                orientation="vertical"
                                                                className="h-4 mx-2"
                                                            />
                                                            <div className="h-auto text-sm font-medium leading-none bg-[#f4f4f5] px-[4px] py-[5px] rounded-md  items-center inline-flex whitespace-nowrap">
                                                                {selectedSupplier?.name}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                align="start"
                                                className="p-0 w-50"
                                            >
                                                <div className="p-2 border-b">
                                                    <div className="relative">
                                                        <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <input
                                                            type="text"
                                                            className="pl-6 h-full rounded outline-0 focus:outline-0"
                                                            placeholder="Nhà sản xuất"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-2">
                                                    <ul>
                                                        {productSupplier?.map(
                                                            (supplier, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="relative flex items-center gap-x-1 hover:bg-gray-100 p-2 rounded-lg hover:cursor-pointer text-sm font-medium"
                                                                    onClick={() => {
                                                                        setCurrentPage(1);
                                                                        setSelectedSupplier(
                                                                            supplier
                                                                        );
                                                                    }}
                                                                >
                                                                    {selectedSupplier ===
                                                                        supplier && (
                                                                            <Check className="h-4 w-4 absolute left-2" />
                                                                        )}
                                                                    <span className="pl-5">
                                                                        {supplier.name}
                                                                    </span>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        {(selectedSupplier !== null || selectedCategory !== null) && (
                                            <div
                                                className="whitespace-nowrap text-sm font-medium leading-none flex items-center bg-red-600 gap-1 cursor-pointer hover:bg-red-500 px-4 rounded-md"
                                                onClick={() => {
                                                    setCurrentPage(1);
                                                    setSelectedSupplier(null)
                                                    setSelectedCategory(null)
                                                }}
                                            >
                                                <span className='text-white'>Bỏ lọc</span>
                                                <X className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
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

