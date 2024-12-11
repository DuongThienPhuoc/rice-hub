/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import DropdownSearchBar from "@/components/searchbar/dropdownSearchBar";
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import { PenBox, PlusIcon, Save, X } from 'lucide-react';
import { Skeleton, Paper } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Separator } from '@/components/ui/separator';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import PricePageBreadcrumb from '@/app/(admin)/prices/breadcrumb';

interface RowData {
    [key: string]: any;
}

export default function PriceTable() {
    const { toast } = useToast();
    const router = useRouter();
    const { setBreadcrumb } = useBreadcrumbStore();
    const [onPageChange, setOnPageChange] = useState(false);

    const handleSearch = (field: string, query: string) => {
        setCurrentPage(1);
        setCurrentSearch({ field, query });
    };
    const [products, setProducts] = useState<RowData[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [prices, setPrices] = useState<RowData[]>([]);
    const [currentPrice, setCurrentPrice] = useState<RowData>();
    const [currentInput, setCurrentInput] = useState(0);
    const [loadingData, setLoadingData] = useState(true);
    const [currentSearch, setCurrentSearch] = useState<{ field?: string, query?: string }>({
        field: '',
        query: ''
    });

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
            params.append('warehouseId', '2');
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

    const getPrices = async () => {
        try {
            const url = `/price/all`;
            const response = await api.get(url);
            const data = response.data;
            console.log(data);
            setPrices(data);
            setCurrentPrice(
                currentPrice
                    ? data.find((item: { id: any; }) => item.id === currentPrice.id) || data[0]
                    : data[0]
            );
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy giá sản phẩm!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        }
    };

    useEffect(() => {
        getPrices()
        setBreadcrumb(<PricePageBreadcrumb />)

        return () => setBreadcrumb(null)
    }, []);

    useEffect(() => {
        getProducts(currentPage, currentSearch);
    }, [currentPage, currentSearch]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePriceChange = (value: any) => {
        setCurrentPrice(value);
    }

    const handleSubmit = async (productId: number, priceId: number, unitPrice: number) => {
        setOnPageChange(true);
        try {
            const formData = ({
                productPrice: [
                    {
                        unitPrice: unitPrice,
                        productId: productId,
                        priceId: priceId
                    }
                ]
            })
            const response = await api.post(`/price/admin/UpdateProductPrice`, formData);
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Cập nhật thành công',
                    description: `Giá sản phẩm đã được cập nhật thành công`,
                    duration: 3000,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                })
                setOnPageChange(false);
                getPrices();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Cập nhật thất bại',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    duration: 3000,
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                })
                setOnPageChange(false);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Cập nhật thất bại',
                duration: 3000,
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
            setOnPageChange(false);
        }
    };

    const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

    const handleEditClick = (rowIndex: number, price: any) => {
        setCurrentInput(price);
        setEditingRowIndex(rowIndex);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCurrentInput(value === '' ? 0 : parseFloat(value));
    };

    const handleSave = (rowIndex: number) => {
        setEditingRowIndex(null);
        if (currentPrice) {
            handleSubmit(products[rowIndex].id, currentPrice.id, currentInput);
        } else {
            handleSubmit(products[rowIndex].id, 1, currentInput);
        }
        setCurrentInput(0);
    };

    const handleCancel = () => {
        setEditingRowIndex(null);
        setCurrentInput(0);
    };

    const formatCurrency = (value: number | string) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
    };

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
                                <div className='font-bold text-[1.25rem]'>Bảng giá</div>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý danh sách bảng giá
                                </p>
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-5'>
                            <SearchBar
                                onSearch={handleSearch}
                                loadingData={loadingData}
                                selectOptions={[
                                    { value: 'productCode', label: 'Mã sản phẩm' },
                                    { value: 'productName', label: 'Tên sản phẩm' },
                                ]}
                            />
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                                {loadingData ? (
                                    <>
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg ml-2 mt-4 lg:mt-0 px-3 py-3' />
                                        <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg ml-2 mt-4 lg:mt-0 px-3 py-3' />
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => {
                                            router.push("/prices/create")
                                            setOnPageChange(true)
                                        }} className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] bg-[#4ba94d] font-semibold hover:bg-green-500'>
                                            Thêm bảng giá
                                            <PlusIcon />
                                        </Button>
                                        <DropdownSearchBar
                                            onChange={handlePriceChange}
                                            selectOptions={
                                                prices.length !== 0 ? (
                                                    prices.map((price) => ({
                                                        value: price,
                                                        label: price?.name
                                                    }))
                                                ) : [
                                                    { value: 'default', label: 'Chưa có bảng giá nào' }
                                                ]
                                            }
                                        />
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
                                    <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                                        <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                            <TableHead className='bg-[#0090d9]'>
                                                <TableRow>
                                                    <TableCell>
                                                        <p className={`font-semibold text-white`}>
                                                            Mã sản phẩm
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className={`font-semibold text-white`}>
                                                            Tên sản phẩm
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className={`font-semibold text-white`}>
                                                            Danh mục
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className={`font-semibold text-white`}>
                                                            Nhà cung cấp
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className={`font-semibold text-white`}>
                                                            Giá nhập
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className={`font-semibold text-white`}>
                                                            Đơn giá (kg)
                                                        </p>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <p className={`font-semibold text-white`}>
                                                            Hành động
                                                        </p>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {products.length !== 0 ? (
                                                    products.map((product, rowIndex) => {
                                                        const matchingProductPrice = currentPrice?.productPrices?.find(
                                                            (pPrice: any) => pPrice?.product?.id === product?.id || pPrice?.product === product?.id
                                                        );
                                                        if (product.active === false) {
                                                            return (
                                                                <TableRow key={rowIndex}>
                                                                    <TableCell onClick={() => router.push(`/products/${product?.id}`)} className="text-blue-500 max-w-[200px] cursor-pointer hover:text-blue-300 font-semibold">
                                                                        {product?.productCode}
                                                                    </TableCell>
                                                                    <TableCell className="max-w-[200px]">
                                                                        {product?.productName}
                                                                    </TableCell>
                                                                    <TableCell className="max-w-[200px]">
                                                                        {product?.categoryName}
                                                                    </TableCell>
                                                                    <TableCell className="max-w-[200px]">
                                                                        {product?.supplierName}
                                                                    </TableCell>
                                                                    <TableCell className="max-w-[200px]">
                                                                        {formatCurrency(product?.price || 0)}
                                                                    </TableCell>
                                                                    <TableCell className="max-w-[200px]">
                                                                        {editingRowIndex === rowIndex ? (
                                                                            <input
                                                                                min={0}
                                                                                type="number"
                                                                                value={currentInput}
                                                                                onChange={(e) => {
                                                                                    if (Number(e.target.value) >= 0) {
                                                                                        handleInputChange(e)
                                                                                    }
                                                                                }}
                                                                                className="border-b-2 border-gray-300 w-[100px] focus:border-gray-500 focus:outline-none"
                                                                            />
                                                                        ) : (
                                                                            formatCurrency(matchingProductPrice?.unit_price || 0)
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell align='center' className="text-center px-4 py-3">
                                                                        <div className="flex min-w-[100px] justify-center space-x-3">
                                                                            {editingRowIndex === rowIndex ? (
                                                                                <>
                                                                                    <div className='relative group'>
                                                                                        <button
                                                                                            onClick={() => handleSave(rowIndex)}
                                                                                            className="group w-6 h-6 md:w-auto md:h-auto"
                                                                                        >
                                                                                            <Save size={18} />
                                                                                        </button>
                                                                                        <span className="absolute text-center w-[60px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                            Lưu
                                                                                        </span>
                                                                                    </div>
                                                                                    <span className="px-1">|</span>
                                                                                    <div className='relative group'>
                                                                                        <button
                                                                                            onClick={() => handleCancel()}
                                                                                            className="group w-6 h-6 md:w-auto md:h-auto"
                                                                                        >
                                                                                            <X size={20} />
                                                                                        </button>
                                                                                        <span className="absolute text-center w-[60px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                            Hủy
                                                                                        </span>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <div className="relative group">
                                                                                    <button
                                                                                        onClick={() => handleEditClick(rowIndex, matchingProductPrice?.unit_price)}
                                                                                        className="group w-12 h-6 md:w-auto md:h-auto"
                                                                                    >
                                                                                        <PenBox size={18} />
                                                                                    </button>
                                                                                    <span className="absolute text-center w-[80px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                                                                        Chỉnh sửa
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        }
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={7}>
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

