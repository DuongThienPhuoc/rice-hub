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
import api from "../../../../api/axiosConfig";
import { useRouter } from 'next/navigation';
import FloatingButton from '@/components/floating/floatingButton';
import { Paper, Skeleton, TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

const Page = () => {
    const router = useRouter();
    const [loadingData, setLoadingData] = useState(true);
    const [products, setProducts] = useState<any>([]);
    const { toast } = useToast();

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        setLoadingData(true);
        try {
            const url = `/productwarehouse/getAllProducts`;
            const response = await api.get(url);
            const data = response.data;
            setProducts(data?.filter((p: any) => p?.quantity > 0));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async () => {
        if (products.some((product: any) => product.checkQuantity === null)) {
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại',
                description: 'Vui lòng nhập đầy đủ số lượng cho từng sản phẩm. Vui lòng kiểm tra lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            });
            return;
        }

        const productData = products.map((product: any) => ({
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
                username: localStorage.getItem("username"),
                warehouseId: 2,
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
        setProducts((prevData: any) => {
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
        <section className="container mx-auto">
            <div className='mx-5'>
                <section className='col-span-4'>
                    <div className='w-full overflow-x-auto'>
                        <div className='flex flex-col lg:flex-row justify-end items-center lg:items-middle my-10'>
                            <div className='flex flex-col lg:flex-row items-center mt-4 lg:mt-0'>
                                {loadingData ? (
                                    <Skeleton animation="wave" variant="rectangular" height={40} width={150} className='rounded-lg' />
                                ) : (
                                    <>
                                        <Button onClick={() => handleSubmit()} className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                                            Tạo phiếu
                                            <Plus />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='overflow-hidden'>
                            <div className='w-full mb-20 overflow-x-auto'>
                                <TableContainer component={Paper} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                                    <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell rowSpan={2} align="center" className='font-semibold'>Mã sản phẩm</TableCell>
                                                <TableCell rowSpan={2} align="center" className='font-semibold'>Tên sản phẩm</TableCell>
                                                <TableCell rowSpan={1} colSpan={2} align="center" className='font-semibold'>Quy cách</TableCell>
                                                <TableCell rowSpan={2} align="center" className='font-semibold'>Số lượng</TableCell>
                                                <TableCell rowSpan={2} align="center" className='font-semibold'>Mô tả</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center" className='font-semibold'>
                                                    Loại
                                                </TableCell>
                                                <TableCell align="center" className='font-semibold'>
                                                    Trọng lượng
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {products && products.map((product: any, index: any) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center" onClick={() => router.push(`/products/${product?.product?.id}`)} component="th" scope="row" className='text-blue-500 font-semibold hover:text-blue-300 cursor-pointer'>
                                                        {product?.product?.productCode}
                                                    </TableCell>
                                                    <TableCell align="center">{product?.product?.name}</TableCell>
                                                    <TableCell align="center">{product?.unit}</TableCell>
                                                    <TableCell align="center">{product?.weightPerUnit} kg</TableCell>
                                                    <TableCell align="center">
                                                        <TextField
                                                            type={'number'}
                                                            className='w-[100px]'
                                                            inputProps={{ min: 1 }}
                                                            onChange={(e) => {
                                                                handleFieldChange('checkQuantity', Number(e.target.value), index)
                                                            }}
                                                            value={product?.checkQuantity}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            label={'Số lượng'}
                                                            variant="standard" />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <TextField
                                                            type={'text'}
                                                            className='w-[250px]'
                                                            onChange={(e) => {
                                                                handleFieldChange('checkDescription', e.target.value, index)
                                                            }}
                                                            value={product?.checkDescription}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            multiline
                                                            rows={2}
                                                            label={'Mô tả'}
                                                            variant="standard" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </section>
                <FloatingButton />
            </div>
        </section>
    );
};

export default Page;
