/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import SearchBar from '@/components/searchbar/searchbar';
import Paging from '@/components/paging/paging';
import { useEffect, useState } from "react";
import FloatingButton from "@/components/floating/floatingButton";
import DropdownSearchBar from "@/components/searchbar/dropdownSearchBar";
import api from "../../../api/axiosConfig";
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { Skeleton, Paper } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface RowData {
    [key: string]: any;
}

export default function PriceTable() {
    const { toast } = useToast();
    const router = useRouter();

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
                getPrices();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Cập nhật thất bại',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    duration: 3000,
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                })
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Cập nhật thất bại',
                duration: 3000,
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
        }
    };

    const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

    const handleEditClick = (rowIndex: number) => {
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
            <div className="flex">
                <div className='w-full overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            loadingData={loadingData}
                            selectOptions={[
                                { value: 'productCode', label: 'Mã sản phẩm' },
                                { value: 'productName', label: 'Tên sản phẩm' },
                                { value: 'category', label: 'Danh mục' },
                                { value: 'brand', label: 'Thương hiệu' }
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
                                    <Button onClick={() => router.push("/prices/create")} className='ml-2 mt-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
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
                                                { value: 'default', label: 'No prices available' }
                                            ]
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <div className='w-full mb-20 overflow-x-auto'>
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
                                <TableContainer component={Paper} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                                    <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='center' className={`pt-3 bg-white font-semibold text-black px-2 py-2 rounded-tl-2xl`}>
                                                    <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                                        Mã sản phẩm
                                                    </div>
                                                </TableCell>
                                                <TableCell align='center' className={`pt-3 bg-white font-semibold text-black px-2 py-2 rounded-tl-2xl`}>
                                                    <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                                        Tên sản phẩm
                                                    </div>
                                                </TableCell>
                                                <TableCell align='center' className={`pt-3 bg-white font-semibold text-black px-2 py-2 rounded-tl-2xl`}>
                                                    <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                                        Giá nhập
                                                    </div>
                                                </TableCell>
                                                <TableCell align='center' className={`pt-3 bg-white font-semibold text-black px-2 py-2 rounded-tl-2xl`}>
                                                    <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                                        Đơn giá (kg)
                                                    </div>
                                                </TableCell>
                                                <TableCell align='center' className="bg-white font-semibold text-black px-2 py-2 rounded-tr-lg">#</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {products.length !== 0 ? (
                                                products.map((product, rowIndex) => {
                                                    const matchingProductPrice = currentPrice?.productPrices?.find(
                                                        (pPrice: any) => pPrice?.product?.id === product?.id || pPrice?.product === product?.id
                                                    );

                                                    return (
                                                        <TableRow key={rowIndex}>
                                                            <TableCell className="text-center max-w-[200px] px-4 py-3 rounded-bl-lg">
                                                                {product?.productCode}
                                                            </TableCell>
                                                            <TableCell className="text-center max-w-[200px] px-4 py-3">
                                                                {product?.productName}
                                                            </TableCell>
                                                            <TableCell className="text-center max-w-[200px] px-4 py-3">
                                                                {formatCurrency(product?.importPrice || 0)}
                                                            </TableCell>
                                                            <TableCell className="text-center max-w-[200px] px-4 py-3">
                                                                {editingRowIndex === rowIndex ? (
                                                                    <input
                                                                        min={0}
                                                                        type="number"
                                                                        value={currentInput || matchingProductPrice?.unit_price || product.price}
                                                                        onChange={handleInputChange}
                                                                        className="border-b-2 border-gray-300 text-center w-[100px] focus:border-gray-500 focus:outline-none"
                                                                    />
                                                                ) : (
                                                                    formatCurrency(matchingProductPrice?.unit_price || product?.price)
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-center px-4 py-3">
                                                                <div className="flex min-w-[100px] justify-center space-x-3">
                                                                    {editingRowIndex === rowIndex ? (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleSave(rowIndex)}
                                                                                className="group w-6 h-6 md:w-auto md:h-auto hover:text-green-500"
                                                                            >
                                                                                Lưu
                                                                            </button>
                                                                            <span className="px-1">|</span>
                                                                            <button
                                                                                onClick={() => handleCancel()}
                                                                                className="group w-6 h-6 md:w-auto md:h-auto hover:text-red-500"
                                                                            >
                                                                                Hủy
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleEditClick(rowIndex)}
                                                                            className="group w-12 h-6 md:w-auto md:h-auto hover:text-blue-500"
                                                                        >
                                                                            Sửa
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5}>
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
            <FloatingButton />
        </div>
    );
};

