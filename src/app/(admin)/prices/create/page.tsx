/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "../../../../api/axiosConfig";
import { Trash2 } from 'lucide-react';
import { Autocomplete, TextField } from '@mui/material';

interface RowData {
    [key: string]: any;
}

const Page = () => {
    const router = useRouter();
    const [prices, setPrices] = useState<RowData[]>([]);
    const [customers, setCustomers] = useState<RowData[]>([]);
    const [priceName, setPriceName] = useState('');
    const [priceCustomer, setPriceCustomer] = useState<RowData | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<RowData | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<RowData | null>(null);

    const getPrices = async () => {
        try {
            const url = `/price/all`;
            const response = await api.get(url);
            const data = response.data;
            console.log(data);
            setPrices(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bảng giá:", error);
        }
    };

    useEffect(() => {
        setSelectedPrice(prices.find(price => price.id === selectedPrice?.id) || null);
        setPriceCustomer(selectedPrice?.customers)
    }, [selectedPrice, prices])

    useEffect(() => {
        getCustomers();
    }, []);

    const getCustomers = async () => {
        try {
            const url = `/customer/all`;
            const response = await api.get(url);
            const data = response.data;
            setCustomers(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
        }
    };

    const handlePriceNameChange = (e: string) => {
        setPriceName(e);
    }

    useEffect(() => {
        getPrices();
    }, []);

    const handleCreatePrice = async () => {
        if (priceName === '' || priceName.trim().length < 1) {
            alert('Vui lòng nhập tên bảng giá');
            return;
        }

        const formData = ({
            customerIds: [
                0
            ],
            name: priceName
        })

        try {
            const response = await api.post(`/price/admin/AddPrice`, formData);
            if (response.status >= 200 && response.status < 300) {
                alert(`Tạo bảng giá thành công`);
                getPrices();
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    }

    const handleApplyPrice = async () => {
        if (!selectedPrice) {
            alert('Vui lòng chọn bảng giá');
            return;
        }

        if (!selectedCustomer) {
            alert('Vui lòng chọn khách hàng');
            return;
        }

        const formData = ({
            customerIds: selectedCustomer.id,
            priceId: selectedPrice.id,
        })

        try {
            const response = await api.post(`/price/admin/UpdateCustomerPrice`, formData);
            if (response.status >= 200 && response.status < 300) {
                alert(`Áp dụng bảng giá cho khách hàng thành công`);
                getPrices();
            } else {
                throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    }

    return (
        <div>
            <div className='flex my-16 justify-center w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        <div className={`flex-1`}>
                            <div
                                className={`w-[100%] mt-5 lg:mt-10 p-[7px] text-center text-white bg-black`}
                                style={{ boxShadow: '3px 3px 5px lightgray' }}
                            >
                                <strong>Thông tin bảng giá</strong>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:px-10 px-2 mt-10">
                        {/* Price List Section */}
                        <div className="flex-1 lg:pr-5">
                            <div className="m-5 flex flex-col lg:flex-row items-center">
                                <span className="font-bold lg:w-1/4 w-full pt-2">Tên bảng giá:</span>
                                <TextField
                                    type="text"
                                    className="lg:w-2/4 w-full lg:mx-5 my-4"
                                    onChange={(e) => handlePriceNameChange(e.target.value)}
                                    value={priceName}
                                    label="Nhập tên bảng giá"
                                    variant="standard"
                                />
                                <Button
                                    onClick={handleCreatePrice}
                                    className="lg:w-1/4 w-full lg:ml-2 py-2 text-[14px] hover:bg-gray-700 bg-gray-800 text-white"
                                >
                                    Tạo bảng giá mới
                                </Button>
                            </div>

                            <div className="m-10 max-h-[300px] overflow-y-auto">
                                {prices.length > 0 ? (
                                    prices.map((price, index) => (
                                        <div key={price.id} className="flex items-center my-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPrice(price)}
                                                className={`flex-1 px-3 py-2 text-[14px] border-2 ${price.id === selectedPrice?.id ? "border-blue-500" : "border-gray-300"
                                                    } rounded-md`}
                                            >
                                                {price.name}
                                            </button>
                                            {index > 0 ? (
                                                <button
                                                    type="button"
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 width={20} />
                                                </button>
                                            ) : (
                                                <div className="ml-2"></div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">Không có bảng giá</p>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 lg:pl-5">
                            <div className="m-5 flex flex-col lg:flex-row items-center">
                                <span className="font-bold lg:w-1/4 w-full">Khách hàng:</span>
                                <Autocomplete
                                    className="lg:w-2/4 w-full lg:mx-5 my-4"
                                    disablePortal
                                    clearOnEscape
                                    options={customers}
                                    getOptionLabel={(option) => option.fullName}
                                    onChange={(event, newValue) => setSelectedCustomer(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="standard" label="Tìm kiếm khách hàng" />
                                    )}
                                />
                                <Button
                                    onClick={handleApplyPrice}
                                    className="lg:w-1/4 w-full lg:ml-2 py-2 text-[14px] hover:bg-gray-700 bg-gray-800 text-white"
                                >
                                    Áp dụng
                                </Button>
                            </div>

                            <div className="mt-6 max-h-[300px] overflow-y-auto p-4">
                                {priceCustomer?.length > 0 ? (
                                    priceCustomer?.map((customer: any) => (
                                        <div key={customer.id} className="flex items-center my-2">
                                            <span className="flex-1 px-3 py-2 text-[14px] border-2 border-gray-300 rounded-md">
                                                {customer.fullName}
                                            </span>
                                            <button
                                                type="button"
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 width={20} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full flex border border-gray-300 justify-center mt-2 items-center py-10 text-gray-500">
                                        Danh sách rỗng
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex justify-center align-bottom items-center mt-5 mb-10'>
                        <Button type='button' onClick={() => router.push("/employees")} className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Trở về</strong>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
