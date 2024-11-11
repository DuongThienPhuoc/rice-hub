/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import api from "../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

const Page = ({ params }: { params: { id: number } }) => {
    const { toast } = useToast();
    const [product, setProduct] = useState<any>(null);
    const [batchProducts, setBatchProducts] = useState<any>(null);
    const router = useRouter();
    const [choice, setChoice] = useState(true);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const url = `/products/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                setProduct(data);
                if (!data?.id) {
                    toast({
                        variant: 'destructive',
                        title: 'Lỗi khi lấy thông tin sản phẩm!',
                        description: 'Xin vui lòng thử lại',
                        duration: 3000
                    })
                }
            } catch (error: any) {
                if (error.response.status === 404) {
                    toast({
                        variant: 'destructive',
                        title: 'Sản phẩm không tồn tại!',
                        description: 'Xin vui lòng thử lại',
                        duration: 3000
                    })
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Hệ thống gặp sự cố khi lấy thông tin sản phẩm!',
                        description: 'Xin vui lòng thử lại sau',
                        duration: 3000
                    })
                }
            } finally {
                setLoadingData(false);
            }
        };
        setLoadingData(true);

        if (params.id) {
            getBatch();
            getProduct();
        }
    }, [params.id]);

    const getBatch = async () => {
        try {
            const url = `/batchproducts/productId/${params.id}`;
            const response = await api.get(url);
            const data = response.data;
            if (Array.isArray(data)) {
                setBatchProducts(data);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy danh sách lô hàng!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        }
    };

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
            <div className='flex my-10 justify-center w-full'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin sản phẩm', 'Thông tin lô hàng'].map((label, index) => (
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
                            ))
                        )}
                    </div>
                    {choice ? (
                        loadingData ? (
                            <div className='flex flex-col lg:flex-row lg:px-10'>
                                <div className='flex-1'>
                                    <div className='mt-10 xl:px-10 flex flex-col items-center'>
                                        <Skeleton animation="wave" variant="rectangular" height={'400px'} width={'90%'} />
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col lg:flex-row lg:px-10'>
                                <div className='flex-1'>
                                    <div className='mt-10 xl:px-10 flex flex-col items-center'>
                                        <img
                                            src={product?.image || "https://via.placeholder.com/400"}
                                            alt='Image'
                                            className="w-[80%] h-[auto] border-[5px] border-black object-cover"
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
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.category?.name}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Nhà cung cấp: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.supplier?.name}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Mô tả: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{product?.description}</span>
                                    </div>

                                    <div className='flex-1'>
                                        <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                            <span className='font-bold flex-1'>Ngày tạo: </span>
                                            <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(product?.createAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className='w-full lg:px-10'>
                            <div className='m-10'>
                                <p className='font-bold mb-5'>Danh sách lô hàng: </p>
                                <div className='overflow-x-auto'>
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
                                            <TableContainer component={Paper} sx={{ border: '1px solid #ccc', borderRadius: 2, overflowX: 'auto' }}>
                                                <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align='center' className='font-semibold'>Mã lô hàng</TableCell>
                                                            <TableCell align='center' className='font-semibold'>Giá nhập (kg)</TableCell>
                                                            <TableCell align='center' className='font-semibold'>Quy cách</TableCell>
                                                            <TableCell align='center' className='font-semibold'>Số lượng</TableCell>
                                                            <TableCell align='center' className='font-semibold'>Mô tả</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {batchProducts && batchProducts.length !== 0 ? (
                                                            batchProducts.map((row: any, rowIndex: any) => (
                                                                <TableRow key={rowIndex} className={`font-semibold border border-gray-200 bg-white`}>
                                                                    <TableCell align='center' className='font-semibold text-blue-500 hover:text-blue-300 cursor-pointer' onClick={() => router.push(`/batches/${row?.batch?.batchCode}`)}>
                                                                        {row?.batch?.batchCode}
                                                                    </TableCell>
                                                                    <TableCell align='center'>{row?.price}</TableCell>
                                                                    <TableCell align='center'>{row?.unit + ' ' + row?.weightPerUnit} kg</TableCell>
                                                                    <TableCell align='center'>{row?.quantity}</TableCell>
                                                                    <TableCell align='center'>{row?.description}</TableCell>
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
                            </div>
                        </div>
                    )}
                    <div className='w-full flex justify-center items-center my-10'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 mr-2 py-3' />
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 ml-2 py-3' />
                            </>
                        ) : (
                            <>
                                <Button type='button' onClick={() => router.push(`/products/update/${params.id}`)} className='px-5 mr-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Sửa</strong>
                                </Button>
                                <Button type='button' onClick={() => router.push("/products")} className='px-5 ml-2 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Trở về</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Page;