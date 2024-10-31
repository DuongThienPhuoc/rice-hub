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
import { LinearProgress } from '@mui/material';
import { PlusIcon } from 'lucide-react';

interface RowData {
    [key: string]: any;
}

export default function PriceTable() {
    const router = useRouter();
    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };
    const [products, setProducts] = useState<RowData[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [prices, setPrices] = useState<RowData[]>([]);
    const [currentPrice, setCurrentPrice] = useState<RowData>();
    const [currentInput, setCurrentInput] = useState(0);

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
            const url = `/products/admin/products?${params.toString()}`;
            const response = await api.get(url);
            const data = response.data;
            console.log(data);
            setProducts(data._embedded.adminProductDtoList);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
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
            console.error("Lỗi khi lấy danh sách bảng giá:", error);
        }
    };

    useEffect(() => {
        getPrices()
    }, []);

    useEffect(() => {
        getProducts(currentPage);
    }, [currentPage]);

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
            console.log(formData);
            if (response.status >= 200 && response.status < 300) {
                alert(`Cập nhật giá thành công`);
                getPrices();
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
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
        <div>
            <div className="flex">
                <div className='w-full overflow-x-auto'>
                    <div className='flex flex-col lg:flex-row justify-between items-center lg:items-middle my-10'>
                        <SearchBar
                            onSearch={handleSearch}
                            selectOptions={[
                                { value: 'productCode', label: 'Mã sản phẩm' },
                                { value: 'productName', label: 'Tên sản phẩm' },
                                { value: 'category', label: 'Danh mục' },
                                { value: 'brand', label: 'Thương hiệu' }
                            ]}
                        />
                        <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
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
                        </div>
                    </div>
                    <div className='overflow-hidden'>
                        <div className='w-full mb-20 rounded-2xl overflow-x-auto'>
                            <table className="w-full bg-white border-collapse">
                                <thead>
                                    <tr className="bg-white border border-gray-200">
                                        <th className={`pt-3 bg-white text-black px-2 py-2 rounded-tl-2xl`}>
                                            <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                                Mã sản phẩm
                                            </div>
                                        </th>
                                        <th className={`pt-3 bg-white text-black px-2 py-2 rounded-tl-2xl`}>
                                            <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                                Tên sản phẩm
                                            </div>
                                        </th>
                                        <th className={`pt-3 bg-white text-black px-2 py-2 rounded-tl-2xl`}>
                                            <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                                Giá nhập
                                            </div>
                                        </th>
                                        <th className={`pt-3 bg-white text-black px-2 py-2 rounded-tl-2xl`}>
                                            <div className='flex items-center justify-center' style={{ fontSize: '15px' }}>
                                                Đơn giá (kg)
                                            </div>
                                        </th>
                                        <th className="bg-white text-black px-2 py-2 rounded-tr-lg">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length !== 0 ? (
                                        products.map((product, rowIndex) => {
                                            const matchingProductPrice = currentPrice?.productPrices?.find(
                                                (pPrice: any) => pPrice?.product?.id === product?.id || pPrice?.product === product?.id
                                            );

                                            return (
                                                <tr key={rowIndex} className="font-semibold border border-gray-200 bg-white">
                                                    <td className="text-center max-w-[200px] px-4 py-3 rounded-bl-lg">
                                                        {product?.productCode}
                                                    </td>
                                                    <td className="text-center max-w-[200px] px-4 py-3">
                                                        {product?.productName}
                                                    </td>
                                                    <td className="text-center max-w-[200px] px-4 py-3">
                                                        {formatCurrency(product?.importPrice || 0)}
                                                    </td>
                                                    <td className="text-center max-w-[200px] px-4 py-3">
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
                                                    </td>
                                                    <td className="text-center px-4 py-3">
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
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="my-4 mx-4">
                                                    <LinearProgress color="inherit" />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
