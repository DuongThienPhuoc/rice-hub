/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/navbar/sidebar';
import React, { useEffect, useState } from 'react';
import api from "../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Page = ({ params }: { params: { id: string } }) => {
    const [batch, setBatch] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const getBatch = async () => {
            try {
                const url = `/batches/batchCode/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                console.log(data);
                setBatch(data);
            } catch (error) {
                console.error("Error fetching batch:", error);
            }
        };

        if (params.id) {
            getBatch();
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
            <div className='flex my-16 justify-center px-5 w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {['Thông tin lô hàng'].map((label, index) => (
                            <div key={index} className={`flex-1 ${index === 0 ? 'flex justify-end' : ''}`}>
                                <div
                                    className={`w-[100%] text-center mt-5 lg:mt-10 p-[7px] text-white bg-black hover:bg-[#1d1d1fca]}`}
                                    style={{ boxShadow: '3px 3px 5px lightgray' }}
                                >
                                    <strong>{label}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col mt-10 lg:flex-row lg:px-10'>
                        <div className='flex-1'>
                            <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                <span className='font-bold flex-1'>Mã lô: </span>
                                <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{batch?.batchCode}</span>
                            </div>

                            <div className='m-10 flex flex-col lg:flex-row'>
                                <span className='font-bold flex-1'>Ngày nhập: </span>
                                <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(batch?.importDate)}</span>
                            </div>

                            <div className='m-10 flex flex-col lg:flex-row'>
                                <span className='font-bold flex-1'>Người nhập: </span>
                                <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{batch?.batchCreator.fullName}</span>
                            </div>
                        </div>
                        <div className='flex-1'>
                            <div className='m-0 flex flex-col lg:flex-row'>
                                <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                    <span className='font-bold flex-1'>Danh sách sản phẩm: </span>
                                    <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>
                                        {batch?.batchProducts?.map((bp: any) => (
                                            <div key={bp?.id}>
                                                <a onClick={() => router.push(`/products/${bp?.product?.id}`)} className='hover:text-blue-400 cursor-pointer'>{bp?.product?.productCode} - {bp?.product?.name}</a>
                                            </div>
                                        ))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex justify-center items-center my-10'>
                        <Button type='button' onClick={() => router.push("/batches")} className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Trở về</strong>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;