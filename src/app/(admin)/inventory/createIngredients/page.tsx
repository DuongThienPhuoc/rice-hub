/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import FloatingButton from '@/components/floating/floatingButton';
import { Checkbox, Paper, Skeleton, TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Check, CircleMinus, CirclePlus, Plus, Search, X } from 'lucide-react';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import InventoryPageBreadcrumb from '@/app/(admin)/inventory/createIngredients/breadcrumb';
import Paging from '@/components/paging/paging';
import SearchBar from '@/components/searchbar/searchbar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getSuppliers, Supplier } from '@/data/supplier';
import { Category, getCategories } from '@/data/category';

interface RowData {
    [key: string]: any;
}

const Page = () => {
    const router = useRouter();
    const [loadingData, setLoadingData] = useState(true);
    const [products, setProducts] = useState<RowData[]>([]);
    const { toast } = useToast();
    const [onPageChange, setOnPageChange] = useState(false);
    const { setBreadcrumb } = useBreadcrumbStore()
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState<RowData[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [productSupplier, setProductSupplier] = useState<Supplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [productCategories, setProductCategories] = useState<Category[]>([]);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });
    useEffect(() => {
        setBreadcrumb(<InventoryPageBreadcrumb />)
        return () => setBreadcrumb(null)
    }, [setBreadcrumb]);

    useEffect(() => {
        getProducts(currentPage, currentSearch, selectedCategory, selectedSupplier);
    }, [currentPage, currentSearch, selectedCategory, selectedSupplier]);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
            params.append("pageSize", "5");
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
            params.append("warehouseId", '1');
            const url = `/productwarehouse/getAllProductsWarehouse?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            if (data.page.totalElements === 0) {
                setProducts([]);
            } else {
                setProducts(data._embedded.productWarehouseDtoList);
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

    const handleRemoveProduct = (index: number) => {
        setSelectedProducts((prevData: RowData[]) =>
            prevData.filter((_, i) => i !== index)
        );
    };

    useEffect(() => {
        fetchCategories()
            .catch((e) => console.error(e));
        fetchSuppliers()
            .catch((e) => console.error(e));
    }, []);

    const handleSubmit = async () => {
        const productData = selectedProducts.map((product: any) => ({
            weightPerUnit: product.weightPerUnit,
            productId: product.product.id,
            description: product.checkDescription || '',
            unit: product.unit,
            quantity: product.checkQuantity || 0,
            systemQuantity: product.quantity || 0,
            quantity_discrepancy: product.checkQuantity - product.quantity,
        }));

        try {
            const url = `/inventory/createInventory`
            const response = await api.post(url, {
                warehouseId: 1,
                inventoryDetails: productData,
            });
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Tạo thành công',
                    description: `Phiếu kiểm kho đã được tạo thành công`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                router.push("/inventory");
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Tạo phiếu kiểm kho thất bại',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                    duration: 3000
                })
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Tạo phiếu kiểm kho thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    }

    const handleFieldChange = (fieldName: any, value: any, index: any) => {
        setSelectedProducts((prevData: any) => {
            return prevData.map((item: any, i: any) => {
                if (i === index) {
                    return {
                        ...item,
                        [fieldName]: value,
                    };
                }
                return item;
            });
        });
    };


    return (
        <section className="container mx-auto mb-20">
            <div className='mx-5'>
                <section className='col-span-4'>
                    <div className='w-full'>
                        <div className='p-5 bg-white rounded-lg'>
                            {loadingData ? (
                                <div className='mb-5'>
                                    <Skeleton animation="wave" variant="text" height={40} width={100} className='rounded-lg' />
                                    <Skeleton animation="wave" variant="text" height={30} width={200} className='rounded-lg' />
                                </div>
                            ) : (
                                <div className="space-y-2 mb-5">
                                    <div className='font-bold text-[1.25rem]'>Nguyên liệu</div>
                                    <p className="text-sm text-muted-foreground">
                                        Tạo phiếu kiểm kho nguyên liệu
                                    </p>
                                </div>
                            )}
                            <Separator orientation="horizontal" />
                            <div className='flex flex-col lg:flex-row items-center lg:items-middle my-5'>
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
                            </div>
                            <div className='overflow-hidden'>
                                <div className='w-full overflow-x-auto'>
                                    {loadingData ? (
                                        <div className="w-full">
                                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                            {Array.from({ length: 10 }).map((_, rowIndex) => (
                                                <div key={rowIndex} className="flex mt-2">
                                                    <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <TableContainer
                                            component={Paper}
                                            sx={{ border: '1px solid #0090d9', borderRadius: 2, maxHeight: 500, overflow: 'auto' }}
                                        >
                                            <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                                <TableHead className="bg-[#0090d9]">
                                                    <TableRow>
                                                        <TableCell>
                                                            <p className="font-semibold text-white">Mã sản phẩm</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="font-semibold text-white">Tên sản phẩm</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="font-semibold text-white">Danh mục</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="font-semibold text-white">Nhà sản xuất</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="font-semibold text-white">Quy cách</p>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <p className="font-semibold text-white">Thêm vào danh sách</p>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {products && products.length > 0 ? (
                                                        products.map((product: any, index: any) => (
                                                            <TableRow
                                                                key={index}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell
                                                                    onClick={() => router.push(`/products/${product?.product?.id}`)}
                                                                    component="th"
                                                                    scope="row"
                                                                    className="text-blue-500 font-semibold hover:text-blue-300 cursor-pointer"
                                                                >
                                                                    {product?.product?.productCode}
                                                                </TableCell>
                                                                <TableCell>{product?.product?.name}</TableCell>
                                                                <TableCell>{product?.product?.categoryName}</TableCell>
                                                                <TableCell>{product?.product?.supplierName}</TableCell>
                                                                <TableCell>
                                                                    {product?.unit} {product?.weightPerUnit} kg
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Checkbox
                                                                        checked={selectedProducts.some((p) => p.id === product.id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedProducts([...selectedProducts, product]);
                                                                            } else {
                                                                                setSelectedProducts(
                                                                                    selectedProducts.filter((p) => p.id !== product.id)
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={6}>
                                                                <div className="my-10 mx-4 text-center text-gray-500">
                                                                    Không có dữ liệu
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </div>
                            </div>
                            {totalPages > 1 && (
                                <Paging
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                            <div className='overflow-hidden mt-5'>
                                <div className='w-full overflow-x-auto'>
                                    {loadingData ? (
                                        <div className="w-full">
                                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                            {Array.from({ length: 10 }).map((_, rowIndex) => (
                                                <div key={rowIndex} className="flex mt-2">
                                                    <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, maxHeight: 500, overflow: 'auto' }}>
                                            <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                                <TableHead className='bg-[#0090d9]'>
                                                    <TableRow>
                                                        <TableCell><p className='font-semibold text-white'>STT</p></TableCell>
                                                        <TableCell><p className='font-semibold text-white'>Tên sản phẩm</p></TableCell>
                                                        <TableCell><p className='font-semibold text-white'>Danh mục</p></TableCell>
                                                        <TableCell><p className='font-semibold text-white'>Nhà sản xuất</p></TableCell>
                                                        <TableCell><p className='font-semibold text-white'>Quy cách</p></TableCell>
                                                        <TableCell><p className='font-semibold text-white'>Số lượng</p></TableCell>
                                                        <TableCell><p className='font-semibold text-white'>Mô tả</p></TableCell>
                                                        <TableCell align='center'><p className='font-semibold text-white'>Xóa khỏi danh sách</p></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selectedProducts && selectedProducts.length > 0 ? selectedProducts.map((product: any, index: any) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{product?.product?.name}</TableCell>
                                                            <TableCell>{product?.product?.categoryName}</TableCell>
                                                            <TableCell>{product?.product?.supplierName}</TableCell>
                                                            <TableCell>{product?.unit} {product?.weightPerUnit} kg</TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type={'text'}
                                                                    className='w-[100px]'
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        const numericValue = Number(value)
                                                                        if (!isNaN(numericValue) && Number(value) >= 0) {
                                                                            handleFieldChange('checkQuantity', Number(value), index)
                                                                        }
                                                                    }}
                                                                    value={product?.checkQuantity || ''}
                                                                    variant="standard" />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type={'text'}
                                                                    className='w-full'
                                                                    onChange={(e) => {
                                                                        handleFieldChange('checkDescription', e.target.value, index)
                                                                    }}
                                                                    value={product?.checkDescription}
                                                                    variant="standard" />
                                                            </TableCell>
                                                            <TableCell>
                                                                <div onClick={() => handleRemoveProduct(index)} className='w-full cursor-pointer justify-center flex'>
                                                                    <CircleMinus size={20} />
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )) : (
                                                        <TableRow>
                                                            <TableCell colSpan={8}>
                                                                <div className="my-10 mx-4 text-center text-gray-500">
                                                                    Chưa có sản phẩm, vui lòng chọn sản phẩm
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </div>
                            </div>
                            <div className='flex flex-col lg:flex-row justify-end items-center lg:items-middle mt-5'>
                                <div className='flex items-center mt-4 lg:mt-0 space-x-2'>
                                    {loadingData ? (
                                        <>
                                            <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                            <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                            <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => {
                                                setOnPageChange(true)
                                                window.history.back();
                                            }} className='px-4 py-3 text-[14px] bg-red-600 hover:bg-red-500'>
                                                Trở về
                                            </Button>
                                            {/* <Button className='px-3 py-3 text-[14px] bg-[#0090d9] hover:bg-blue-400'>
                                                In phiếu
                                                <Printer />
                                            </Button> */}
                                            <Button onClick={() => handleSubmit()} className='px-3 py-3 text-[14px] hover:bg-green-500'>
                                                Tạo phiếu
                                                <Plus />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
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
        </section>
    );
};

export default Page;
