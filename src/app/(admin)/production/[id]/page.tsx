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
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import { Paper, Skeleton, TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { CheckSquare, CircleX, Upload, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

const Page = ({ params }: { params: { id: number } }) => {
    const router = useRouter();
    const [loadingData, setLoadingData] = useState(true);
    const [production, setProduction] = useState<any>([]);
    const { toast } = useToast();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        getProduction();
    }, []);

    const getProduction = async () => {
        try {
            const url = `/productionOrder/getById/${params.id}`;
            const response = await api.get(url);
            const data = response.data;
            setProduction(data);
        } catch (error) {
            console.error("Lỗi khi lấy phiếu sản xuất:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async () => {
        Swal.fire({
            title: 'Xác nhận phiếu sản xuất',
            text: 'Bạn có chắc chắn muốn xác nhận phiếu sản xuất này, một khi xác nhận sẽ cập nhập số lượng mới lên hệ thống và không thể thay đổi nữa.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, xác nhận',
            cancelButtonText: 'Không!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const url = `/productionOrder/confirm/${params.id}`
                    const response = await api.post(url);
                    if (response.status >= 200 && response.status < 300) {
                        toast({
                            variant: 'default',
                            title: 'Xác nhận thành công',
                            description: `Phiếu sản xuất đã được xác nhận thành công`,
                            style: {
                                backgroundColor: '#4caf50',
                                color: '#fff',
                            },
                            duration: 3000
                        })
                        router.push("/production");
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Xác nhận phiếu sản xuất thất bại',
                            description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                            action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                            duration: 3000
                        })
                    }
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Xác nhận phiếu sản xuất thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
            }
        });
    }

    const handleFinish = async () => {
        try {
            const url = `/productionOrder/finishProduction/${params.id}`
            const response = await api.post(url,
                production?.finishedProducts.map((fp: any) => {
                    return {
                        description: fp.note,
                        realQuantity: fp.realQuantity,
                        defectQuantity: fp.defectQuantity,
                        id: fp.id
                    }
                })
            );
            if (response.status >= 200 && response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Cập nhật thành phẩm thành công',
                    description: `Thành phẩm đã được cập nhật thành công`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                router.push("/production");
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Cập nhật thành phẩm thất bại',
                    description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                    duration: 3000
                })
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Cập nhật thành phẩm thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    }

    const handleCancel = async () => {
        try {
            await api.post(`/productionOrder/cancel/${params.id}`);
            toast({
                variant: 'default',
                title: 'Hủy thành công',
                description: `Phiếu sản xuất đã được hủy thành công`,
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                },
                duration: 3000
            })
            getProduction();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Hủy thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    }

    const handleDelete = async () => {
        try {
            await api.post(`/productionOrder/delete?id=${params.id}`);
            toast({
                variant: 'default',
                title: 'Xóa thành công',
                description: `Phiếu sản xuất đã được xóa thành công`,
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                },
                duration: 3000
            })
            getProduction();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Xóa thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    }

    const showAlert = async () => {
        if (production?.status === 'CANCELED') {
            Swal.fire({
                title: 'Xác nhận xóa vĩnh viễn',
                text: `Phiếu này đã bị hủy trước đó, Nếu tiếp tục xóa thì sẽ không thể khôi phục. Bạn có muốn tiếp tục?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có, xóa!',
                cancelButtonText: 'Không!',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete();
                }
            });
        } else {
            Swal.fire({
                title: 'Xác nhận hủy',
                text: `Bạn có chắc chắn muốn hủy phiếu này?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có, hủy!',
                cancelButtonText: 'Không!',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleCancel();
                }
            });
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

    const handleFieldChange = (index: number, field: string, value: any) => {
        setProduction((prevProduction: any) => {
            const updatedFinishedProducts = [...prevProduction.finishedProducts];
            updatedFinishedProducts[index] = {
                ...updatedFinishedProducts[index],
                [field]: value,
            };

            return {
                ...prevProduction,
                finishedProducts: updatedFinishedProducts,
            };
        });
    };

    const handleConfirm = async () => {
        Swal.fire({
            title: 'Xác nhận hoàn thành',
            text: `Bạn có chắc chắn muốn xác nhận, Một khi đã xác nhận thì sẽ không thể thay đổi được nữa. Bạn có muốn tiếp tục?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, xác nhận!',
            cancelButtonText: 'Không!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const url = `/productionOrder/confirm-done/${params.id}`
                    const response = await api.post(url,
                        production?.finishedProducts?.flatMap((fp: any) => {
                            return fp.productWarehouses?.map((pw: any) => {
                                return {
                                    productWarehouseId: pw.id,
                                    quantity: pw.packQuantity
                                };
                            }) || [];
                        }) || []
                    );

                    if (response.status >= 200 && response.status < 300) {
                        toast({
                            variant: 'default',
                            title: 'Cập nhật thành phẩm thành công',
                            description: `Thành phẩm đã được cập nhật thành công`,
                            style: {
                                backgroundColor: '#4caf50',
                                color: '#fff',
                            },
                            duration: 3000
                        })
                        router.push("/production");
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Cập nhật thành phẩm thất bại',
                            description: 'Đã xảy ra lỗi, vui lòng thử lại.',
                            action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                            duration: 3000
                        })
                    }
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Cập nhật thành phẩm thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
            }
        });
    }

    const handleFieldChange2 = (
        index: number,
        subIndex: number,
        field: string,
        value: any
    ) => {
        setProduction((prevProduction: any) => {
            const updatedFinishedProducts = [...prevProduction.finishedProducts];

            const updatedProductWarehouses = [...updatedFinishedProducts[index].productWarehouses];

            const weightPerUnit = updatedProductWarehouses[subIndex].weightPerUnit || 1;
            const currentValue = updatedProductWarehouses[subIndex][field] || 0;

            const newRealQuantity =
                updatedFinishedProducts[index].realQuantity -
                weightPerUnit * (value - currentValue);

            if (newRealQuantity < 0) {
                return prevProduction;
            }

            updatedProductWarehouses[subIndex] = {
                ...updatedProductWarehouses[subIndex],
                [field]: value,
            };

            updatedFinishedProducts[index] = {
                ...updatedFinishedProducts[index],
                productWarehouses: updatedProductWarehouses,
                realQuantity: newRealQuantity,
            };

            return {
                ...prevProduction,
                finishedProducts: updatedFinishedProducts,
            };
        });
    };

    // const removePackaging = (productIndex: number, packagingIndex: number) => {
    //     setProduction((prevProduction: any) => {
    //         const updatedFinishedProducts = prevProduction.finishedProducts.map((product: any, i: number) => {
    //             if (i === productIndex) {
    //                 const updatedProductWarehouses = [...product.productWarehouses];
    //                 updatedProductWarehouses.splice(packagingIndex, 1);
    //                 return {
    //                     ...product,
    //                     productWarehouses: updatedProductWarehouses,
    //                 };
    //             }
    //             return product;
    //         });

    //         return {
    //             ...prevProduction,
    //             finishedProducts: updatedFinishedProducts,
    //         };
    //     });
    // };


    // const addPackaging = (index: number) => {
    //     setProduction((prevProduction: any) => {
    //         const updatedFinishedProducts = prevProduction.finishedProducts.map((product: any, i: number) => {
    //             if (i === index) {
    //                 const isDuplicate = product.productWarehouses.some((warehouse: any) =>
    //                     warehouse.unit?.toLowerCase() === product.tempUnit?.toLowerCase() &&
    //                     warehouse.weightPerUnit === product.tempWeightPerUnit
    //                 );

    //                 if (isDuplicate) {
    //                     alert("Quy cách và trọng lượng này đã tồn tại!");
    //                     return product;
    //                 }

    //                 return {
    //                     ...product,
    //                     productWarehouses: [
    //                         ...product.productWarehouses,
    //                         { unit: product.tempUnit, weightPerUnit: product.tempWeightPerUnit }
    //                     ],
    //                     tempUnit: '',
    //                     tempWeightPerUnit: ''
    //                 };
    //             }
    //             return product;
    //         });

    //         return {
    //             ...prevProduction,
    //             finishedProducts: updatedFinishedProducts,
    //         };
    //     });
    // };

    return (
        <div>
            <div className='flex my-10 justify-center lg:px-5 w-full'>
                <div className='w-[100%] md:w-[80%] flex bg-white rounded-lg flex-col' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex flex-col lg:flex-row'>
                        {loadingData ? (
                            <Skeleton animation="wave" variant="rectangular" height={40} width={'100%'} className='mt-5 lg:mt-10 p-[7px]' />
                        ) : (
                            ['Thông tin phiếu sản xuất'].map((label, index) => (
                                <div key={index} className={`flex-1 ${index === 0 ? 'flex justify-end' : ''}`}>
                                    <div
                                        className={`w-[100%] text-center mt-5 lg:mt-10 p-[7px] text-white bg-[#4ba94d]`}
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
                                        <span className='font-bold flex-1'>Mã phiếu: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{production?.productionCode}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Nguyên liệu: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{production?.productName} ({production?.unit} {production?.weightPerUnit}kg)</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Khối lượng sản xuất (kg): </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{production?.weightPerUnit * production?.quantity}kg ({production?.quantity} {production?.unit})</span>
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <div className='lg:m-10 mx-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Ngày nhập: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{renderDate(production?.productionDate)}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Người tạo phiếu: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>{production?.creator?.fullName}</span>
                                    </div>
                                    <div className='m-10 flex flex-col lg:flex-row'>
                                        <span className='font-bold flex-1'>Trạng thái: </span>
                                        <span className='flex-[2] lg:ml-5 mt-2 lg:mt-0'>
                                            {production?.status === 'COMPLETED' && 'Sản xuất xong'}
                                            {production?.status === 'CONFIRMED' && 'Hoàn thành'}
                                            {production?.status === 'CANCELED' && 'Đã hủy'}
                                            {production?.status === 'PENDING' && 'Đang chờ xác nhận'}
                                            {production?.status === 'IN_PROCESS' && 'Đang sản xuất'}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='lg:px-10 w-full'>
                        <div className='lg:mx-10 mx-5'>
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
                                    <div className='flex justify-between lg:flex-row flex-col-reverse items-center mb-5'>
                                        <p className='font-bold lg:mt-0 mt-5'>Danh sách thành phẩm: </p>
                                    </div>
                                    <div className='overflow-x-auto max-h-[400px]'>
                                        <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                                            <Table sx={{ minWidth: 1000, borderCollapse: 'collapse' }} aria-label="simple table">
                                                <TableHead className='bg-[#0090d9]'>
                                                    <TableRow>
                                                        <TableCell><p className='font-semibold text-white'>Mã sản phẩm</p></TableCell>
                                                        <TableCell><p className='font-semibold text-white'>Tên sản phẩm</p></TableCell>
                                                        <TableCell><p className='font-semibold text-white'>Tỉ lệ (%)</p></TableCell>
                                                        <TableCell><p className='font-semibold text-white'>Khối lượng dự tính (kg)</p></TableCell>
                                                        {(production?.status === 'IN_PROCESS' || production?.status === 'COMPLETED' || production?.status === 'CONFIRMED') && (
                                                            <>
                                                                <TableCell><p className='font-semibold text-white'>Khối lượng thành phẩm (kg)</p></TableCell>
                                                                <TableCell><p className='font-semibold text-white'>Khối lượng hỏng (kg)</p></TableCell>
                                                                <TableCell><p className='font-semibold text-white'>Ghi chú</p></TableCell>
                                                            </>
                                                        )}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {production?.finishedProducts && production.finishedProducts.map((product: any, index: any) => (
                                                        <TableRow
                                                            key={index}
                                                        >
                                                            <TableCell onClick={() => router.push(`/products/${product.productId}`)} component="th" scope="row" className='text-blue-500 font-semibold hover:text-blue-300 cursor-pointer'>
                                                                {product?.productCode}
                                                            </TableCell>
                                                            <TableCell>{product?.productName}</TableCell>
                                                            <TableCell>{product?.proportion}</TableCell>
                                                            <TableCell>{product?.quantity || '0'}kg</TableCell>
                                                            {(production?.status === 'IN_PROCESS' || production?.status === 'COMPLETED') && (
                                                                <>
                                                                    <TableCell className='max-w-[50px] '>
                                                                        <TextField
                                                                            type={'number'}
                                                                            value={product?.realQuantity || 0}
                                                                            onChange={(e) => {
                                                                                const realQuantity = Number(e.target.value);
                                                                                if (realQuantity >= 0) {
                                                                                    handleFieldChange(index, 'realQuantity', realQuantity);
                                                                                }
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true,
                                                                            }}
                                                                            variant="standard" />
                                                                    </TableCell>
                                                                    <TableCell className='max-w-[50px] '>
                                                                        <TextField
                                                                            type={'number'}
                                                                            value={product?.defectQuantity || 0}
                                                                            onChange={(e) => {
                                                                                const defectQuantity = Number(e.target.value);
                                                                                if (defectQuantity >= 0) {
                                                                                    handleFieldChange(index, 'defectQuantity', defectQuantity);
                                                                                }
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true,
                                                                            }}
                                                                            variant="standard" />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <TextField
                                                                            type={'text'}
                                                                            value={product?.note}
                                                                            onChange={(e) => {
                                                                                handleFieldChange(index, 'note', e.target.value);
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true,
                                                                            }}
                                                                            variant="standard" />
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                            {production?.status === 'CONFIRMED' && (
                                                                <>
                                                                    <TableCell>{product?.realQuantity || 0}kg</TableCell>
                                                                    <TableCell>{product?.defectQuantity || 0}kg</TableCell>
                                                                    <TableCell>{product?.note || 'N/A'}</TableCell>
                                                                </>
                                                            )}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>

                                </>
                            )}
                        </div>
                        <div className='flex justify-center lg:justify-end lg:flex-row flex-col items-end lg:items-center space-y-2 lg:space-y-0 lg:space-x-2 mx-5 lg:mx-10 mt-5'>
                            {(production?.status === 'PENDING' || production?.status === 'CANCELED') && (
                                <Button onClick={() => showAlert()} className='px-5 py-3 text-[14px] bg-red-600 hover:bg-red-500'>
                                    {production?.status === 'CANCELED' ? ('Xóa phiếu') : ('Hủy phiếu')}
                                    <CircleX />
                                </Button>
                            )}
                            {production?.status === 'PENDING' && (
                                <Button onClick={() => handleSubmit()} className='px-5 py-3 text-[14px] hover:bg-green-500'>
                                    Xác nhận sản xuất
                                    <CheckSquare />
                                </Button>
                            )}
                            {(production?.status === 'IN_PROCESS' || production?.status === 'COMPLETED') && (
                                <Button onClick={() => handleFinish()} className="px-5 py-3 text-[14px] hover:bg-green-500">
                                    Cập nhật thành phẩm
                                    <Upload />
                                </Button>
                            )}
                            {production?.status === 'COMPLETED' && (
                                <Button onClick={() => setIsPopupOpen(true)} className='px-5 py-3 text-[14px] hover:bg-green-500'>
                                    Xác nhận hoàn thành
                                    <CheckSquare />
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className='w-full flex justify-center items-center my-10 space-x-2'>
                        {loadingData ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 py-3' />
                                <Skeleton animation="wave" variant="rectangular" height={35} width={80} className='rounded-lg px-5 py-3' />
                            </>
                        ) : (
                            <>
                                {(production?.status === 'PENDING' || production?.status === 'CANCELED') && (
                                    <Button type='button' onClick={() => router.push(`/production/update/${params.id}`)} className='px-5 py-3 text-[14px] hover:bg-green-500'>
                                        <strong>Sửa</strong>
                                    </Button>
                                )}
                                <Button type='button' onClick={() => router.push('/production')} className='px-5 py-3 text-[14px] hover:bg-green-500'>
                                    <strong>Trở về</strong>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 md:rounded-lg shadow-lg md:w-[700px] w-full">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">Xác nhận</h2>
                            <button onClick={() => setIsPopupOpen(false)} className="text-gray-500 hover:text-gray-800">
                                <X size={20} />
                            </button>
                        </div>

                        <p className="mb-4">Vui lòng chọn quy cách đóng gói cho từng thành phẩm:</p>

                        <div className="space-y-4">
                            {production?.finishedProducts.map((product: any, index: any) => (
                                <div key={index} className="border p-4 rounded-lg">
                                    <div className="mb-2">
                                        <h3 className="font-semibold">{product.productName} - ({product.realQuantity}kg)</h3>
                                    </div>

                                    {product.productWarehouses.map((pack: any, packIndex: any) => (
                                        <div key={packIndex} className="flex items-center gap-5 mb-2">
                                            <p className='mt-3'>{packIndex + 1 + '. '} {pack.unit ? pack.unit + ' ' + pack.weightPerUnit + ' kg' : 'Chưa đóng gói'}</p>
                                            <TextField
                                                type={'number'}
                                                value={pack?.packQuantity}
                                                onChange={(e) => {
                                                    if (Number(e.target.value) >= 0) {
                                                        handleFieldChange2(index, packIndex, 'packQuantity', e.target.value);
                                                    }
                                                }}
                                                label="Nhập số lượng"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="standard" />
                                            {/* <button
                                                onClick={() => removePackaging(index, packIndex)}
                                                className="text-red-500 hover:text-red-700 mt-4"
                                            >
                                                Xóa
                                            </button> */}
                                        </div>
                                    ))}

                                    {/* <div className='flex lg:flex-row flex-col lg:justify-between'>
                                        <div className='flex space-x-5'>
                                            <TextField
                                                type={'text'}
                                                value={product?.tempUnit}
                                                onChange={(e) => {
                                                    handleFieldChange(index, 'tempUnit', e.target.value);
                                                }}
                                                label="Nhập loại quy cách"
                                                variant="standard" />
                                            <TextField
                                                type={'number'}
                                                value={product?.tempWeightPerUnit}
                                                onChange={(e) => {
                                                    handleFieldChange(index, 'tempWeightPerUnit', e.target.value);
                                                }}
                                                label="Nhập trọng lượng"
                                                variant="standard" />
                                        </div>
                                        <button
                                            onClick={() => addPackaging(index)}
                                            className="mt-4 md:mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Thêm quy cách
                                        </button>
                                    </div> */}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button
                                onClick={handleConfirm}
                                className="px-4 py-2 text-white hover:bg-green-500"
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Page;
