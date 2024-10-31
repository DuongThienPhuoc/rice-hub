/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import api from "../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import BatchList from "@/components/list/list";

const Page = ({ params }: { params: { id: number } }) => {
    const [product, setProduct] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);

    const columns = [
        { name: 'batch.batchCode', displayName: 'Mã lô hàng' },
        { name: 'description', displayName: 'Mô tả' },
        { name: 'price', displayName: 'Giá nhập (kg)' },
        { name: 'unit', displayName: 'Quy cách' },
        { name: 'quantity', displayName: 'Số lượng' },
    ];

    const titles = [
        { name: '', displayName: '', type: '' },
    ];

    useEffect(() => {
        const getProduct = async () => {
            try {
                const url = `/products/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                console.log(data);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        if (params.id) {
            getProduct();
        }
    }, [params.id]);

    const renderDate = (value: any) => {
        if (value) {
            const date = new Date(value);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } else {
            return '../../....';
        }
    }

    return (
        <div>
            <div className='flex my-16 justify-center w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {['Thông tin sản phẩm', 'Thông tin lô hàng'].map((label, index) => (
                            <div key={index} className={`flex-1 ${index === 0 ? 'flex justify-end' : ''}`}>
                                <button
                                    type='button'
                                    onClick={() => setChoice(index === 0)}
                                    className={`w-[100%] mt-5 lg:mt-10 p-[7px] ${choice === (index === 0)
                                        ? 'text-white bg-black hover:bg-[#1d1d1fca]'
                                        : 'text-black bg-[#f5f5f7] hover:bg-gray-200'
                                        }`}
                                    style={{ boxShadow: '3px 3px 5px lightgray' }}
                                >
                                    <strong>{label}</strong>
                                </button>
                            </div>
                        ))}
                    </div>
                    {choice ? (
                        <div className='flex flex-col lg:flex-row lg:px-10'>
                            <div className='flex-1'>
                                <div className='mt-10 xl:px-10 flex flex-col items-center'>
                                    <img
                                        src={product?.image || "https://via.placeholder.com/400"}
                                        alt='Avatar'
                                        className="w-[90%] h-[400px] border-[5px] border-black object-cover"
                                    />
                                </div>
                            </div>
                            <div className='flex-1'>
                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Mã sản phẩm: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.productCode}</span>
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Tên sản phẩm: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.name}</span>
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Danh mục: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.category.name}</span>
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Nhà cung cấp: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.supplier.name}</span>
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Kho: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.productWarehouses[0]?.warehouse.name}</span>
                                </div>

                                <div className='m-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Mô tả: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.description}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full lg:px-10'>
                            <div className='flex flex-col lg:flex-row'>
                                <div className='flex-1'>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Người nhập: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.batchProducts[0]?.batch?.batchCreator?.fullName}</span>
                                    </div>

                                </div>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày nhập: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(product?.createAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='m-10'>
                                <p className='font-bold mb-5'>Danh sách lô hàng: </p>
                                <div className='overflow-x-auto'>
                                    <BatchList name="Lô hàng" editUrl="" titles={titles} columns={columns} data={product.batchProducts} tableName="batch" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='w-full flex justify-center items-center my-10'>
                        <Button type='button' onClick={() => router.push(`/products/update/${params.id}`)} className='px-5 mr-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Sửa</strong>
                        </Button>
                        <Button type='button' onClick={() => router.push("/products")} className='px-5 ml-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Trở về</strong>
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Page;