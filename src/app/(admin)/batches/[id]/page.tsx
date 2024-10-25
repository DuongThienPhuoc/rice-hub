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
    const [navbarVisible, setNavbarVisible] = useState(false);
    const [batch, setBatch] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const updateNavbarVisibility = () => {
            const shouldShowNavbar = window.innerWidth >= 1100;
            setNavbarVisible(shouldShowNavbar);
        };

        updateNavbarVisibility();

        window.addEventListener('resize', updateNavbarVisibility);

        return () => {
            window.removeEventListener('resize', updateNavbarVisibility);
        };
    }, []);

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
            {navbarVisible ? <Navbar /> : <Sidebar />}
            <div className='flex my-16 justify-center px-5 w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {['Thông tin lô hàng', 'Danh sách sản phẩm'].map((label, index) => (
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
                    <div className='flex flex-col mt-10 lg:flex-row px-10'>
                        <div className='flex-1'>
                            <div className='m-10 flex flex-col lg:flex-row'>
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
                            <div className='mx-10 mb-10 mt-0 lg:m-10 flex flex-col lg:flex-row'>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                                    {/* {products.map((product) => (
                                        <div key={product.id} className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center">
                                            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-4 rounded-lg" />
                                            <h2 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h2>
                                            <p className="text-blue-500 font-semibold text-lg mb-4">{formatCurrency(product.price)}</p>
                                            <button
                                                onClick={() => handleProductClick(product.id)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='w-full flex justify-center items-center my-10'>
                        <Button type='button' onClick={() => router.push("/import")} className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            <strong>Trở về</strong>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;