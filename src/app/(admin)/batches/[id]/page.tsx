/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import api from "../../../../api/axiosConfig";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Checkbox, Paper, Skeleton } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface RowData {
    [key: string]: any;
}

const Page = ({ params }: { params: { id: string } }) => {
    const [batch, setBatch] = useState<any>(null);
    const router = useRouter();
    const [products, setProducts] = useState<RowData[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState<any>([]);

    const handleSelectProduct = (productCode: any) => {
        setSelectedProducts((prevSelected: any) =>
            prevSelected.includes(productCode)
                ? prevSelected.filter((code: any) => code !== productCode)
                : [...prevSelected, productCode]
        );
    };

    useEffect(() => {
        const getBatch = async () => {
            setLoadingData(true);
            try {
                const url = `/batches/batchCode/${params.id}`;
                const response = await api.get(url);
                const data = response.data;
                console.log(data);
                setBatch(data);
            } catch (error) {
                console.error("Error fetching batch:", error);
            } finally {
                setLoadingData(false)
            }
        };

        if (params.id) {
            getProducts();
            getBatch();
        }
    }, [params.id]);

    const getProducts = async () => {
        try {
            const url = `/batchproducts/batchCode/${params.id}`;
            const response = await api.get(url);
            const data = response.data;
            setProducts(data);
            console.log(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
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
            <div className='flex my-10 justify-center px-5 w-full font-arsenal'>
                <div className='w-[95%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin lô hàng'].map((label, index) => (
                                <div key={index} className={`flex-1 ${index === 0 ? 'flex justify-end' : ''}`}>
                                    <div
                                        className={`w-[100%] text-center mt-5 lg:mt-10 p-[7px] text-white bg-black hover:bg-[#1d1d1fca]}`}
                                        style={{ boxShadow: '3px 3px 5px lightgray' }}
                                    >
                                        <strong>{label}</strong>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className='flex flex-col mt-10 lg:flex-row lg:px-10'>
                        {loadingData ? (
                            <>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-1' />
                                        <Skeleton animation="wave" variant="text" height={'30px'} className='flex-[2] lg:ml-5 mt-2 lg:mt-0' />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Mã lô: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{batch?.batchCode}</span>
                                    </div>

                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Người nhập: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{batch?.batchCreator.fullName}</span>
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày nhập: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(batch?.importDate)}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='lg:px-10 w-full lg:mt-0 mt-10'>
                        <div className='mx-10'>
                            {loadingData ? (
                                <div className="w-full">
                                    <Skeleton animation="wave" variant="text" height={'30px'} width={200} className='mb-5' />
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                    {Array.from({ length: 4 }).map((_, rowIndex) => (
                                        <div key={rowIndex} className="flex mt-2">
                                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <p className='font-bold mb-5'>Danh sách sản phẩm: </p>
                                    <div className='overflow-x-auto'>
                                        <TableContainer component={Paper} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                                            <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                                                                checked={selectedProducts.length === products.length}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedProducts(products.map((product) => product.product.productCode));
                                                                    } else {
                                                                        setSelectedProducts([]);
                                                                    }
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center" className='font-semibold'>Mã sản phẩm</TableCell>
                                                        <TableCell align="center" className='font-semibold'>Tên sản phẩm</TableCell>
                                                        <TableCell align="center" className='font-semibold'>Mô tả</TableCell>
                                                        <TableCell align="center" className='font-semibold'>Giá nhập</TableCell>
                                                        <TableCell align="center" className='font-semibold'>Quy cách</TableCell>
                                                        <TableCell align="center" className='font-semibold'>Số lượng</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {products && products.map((product, index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={selectedProducts.includes(product.product.productCode)}
                                                                    onChange={() => handleSelectProduct(product.product.productCode)}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center" onClick={() => router.push(`/products/${product.product.id}`)} component="th" scope="row" className='text-blue-500 font-semibold hover:text-blue-300 cursor-pointer'>
                                                                {product.product.productCode}
                                                            </TableCell>
                                                            <TableCell align="center">{product.product.name}</TableCell>
                                                            <TableCell align="center">{product.product.description}</TableCell>
                                                            <TableCell align="center">{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}</TableCell>
                                                            <TableCell align="center">{product.unit + ' ' + product.weightPerUnit} kg</TableCell>
                                                            <TableCell align="center">{product.quantity}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='w-full flex justify-center items-center my-10'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 py-3' />
                            </>
                        ) : (
                            <>
                                <Button type='button' onClick={() => router.push(`${batch?.receiptType === "IMPORT" ? '/import' : '/export'}`)} className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                    <strong>Trở về</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;